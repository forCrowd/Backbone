import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class NotificationService {
    notification = new Subject<string>();
}
