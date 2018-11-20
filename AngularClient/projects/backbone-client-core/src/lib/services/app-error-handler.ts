import { ErrorHandler, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, forkJoin, from, Observable, of as observableOf, Subscription, timer } from "rxjs";
import { catchError, flatMap, map, mergeMap, share } from "rxjs/operators";
import { BasicSourceMapConsumer, IndexedSourceMapConsumer, SourceMapConsumer } from "source-map";

import { Settings } from "../settings";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  sourceMapCache: Observable<BasicSourceMapConsumer | IndexedSourceMapConsumer>[] = [];
  errorCounter = 0;
  errorLimitResetTimer: Subscription = null;
  get errorLimitReached(): boolean { return this.errorCounter > 10 };

  constructor(private readonly httpClient: HttpClient, private readonly settings: Settings) {
    (SourceMapConsumer as any).initialize({ "lib/mappings.wasm": settings.sourceMapMappingsUrl });
  }

  handleError(error: Error): void {

    if (this.settings.environment === "Development") {

    console.error(error);

    } else {

    this.reportError(error);

    }
  }

  private reportError(error: Error): void {

    this.processErrorLimit();

    if (!this.errorLimitReached) {

      this.getSourceMappedStackTrace(error).subscribe((stack: string) => {

        const model = {
          Name: error.name,
          Message: error.message,
          Url: window.location.href,
          Stack: stack || ""
        };

        const errorHandlerUrl = this.settings.serviceApiUrl + "/Exception/Record";

        this.httpClient.post(errorHandlerUrl, model).subscribe();
      });
    }
  }

  // Retrieve a SourceMap object for a minified script URL
  private getMapForScript(url: string): Observable<BasicSourceMapConsumer | IndexedSourceMapConsumer> {

    if (this.sourceMapCache[url]) {

      return this.sourceMapCache[url];

    } else {

      const observable = this.httpClient.get(url, { responseType: "text" }).pipe(mergeMap(body => {

        const match = body.match(/\/\/# sourceMappingURL=([^"\s]+\.map)/);

        if (match) {
          const sourceMapUrl = match[1];
          return this.httpClient.get(sourceMapUrl, { responseType: "text" })
            .pipe(flatMap(response => {
              return from(SourceMapConsumer.with(response, null, consumer => {
                return consumer;
              }));
            }));
        } else {
          return throwError("no 'sourceMappingURL' regex match");
        }
      })).pipe(share());

      this.sourceMapCache[url] = observable;

      return observable;
    }
  }

  /**
   * Gets stack trace by downloading and parsing .map files
   * Original solutions: http://stackoverflow.com/questions/19420604/angularjs-stack-trace-ignoring-source-map
   * @param exception
   */
  private getSourceMappedStackTrace(error: Error) {

    if (!error.stack) { // not all browsers support stack traces
      return observableOf("");
    }

    const stackLines = error.stack.split(/\n/);

    const stackLineObservables = stackLines.map(stackLine => {

      const match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);

      if (!match) {
        return observableOf(stackLine);
      }

      const prefix = match[1], url = match[2], line = match[3], col = match[4];

      return this.getMapForScript(url).pipe(
        map(consumer => {

          var pos = consumer.originalPositionFor({
            line: parseInt(line, 10),
            column: parseInt(col, 10)
          });

          // Experimental fixes for source
          pos.source = pos.source.substring(0, 3) === "../"
            ? pos.source.substring(2)
            : pos.source.charAt(0) !== "/"
              ? `/${pos.source}`
              : pos.source;

          var mangledName = prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
          var mangledNameValue = (mangledName && mangledName[2]) || "";

          return `    at ${pos.name ? pos.name : mangledNameValue} ${window.location.origin}${pos.source}:${pos.line}:${pos.column}`;

        }))
        .pipe(catchError(() => {
          return stackLine;
        }));

    });

    return forkJoin(stackLineObservables)
      .pipe(map(lines => lines.join("\r\n")));
  }

  /**
   * One client can only send 10 errors per five minutes
   */
  private processErrorLimit(): void {

    if (this.errorCounter === 0) {

      // If there is, unsubscribe from previous subscription
      // TODO: Not sure whether this is necessary but to be sure / coni2k - 05 Jan. '17
      if (this.errorLimitResetTimer) {
        this.errorLimitResetTimer.unsubscribe();
      }

      this.errorLimitResetTimer = timer(5000).subscribe(() => this.errorCounter = 0);
    }

    this.errorCounter++;
  }
}
