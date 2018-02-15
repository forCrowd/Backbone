<!DOCTYPE html>
<html>
<head>
    <title>Backbone API</title>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="favicon.ico?v=0.1.0" />

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<%= forCrowd.Backbone.Framework.AppSettings.GoogleAnalyticsTrackingID %>"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag("js", new Date());

        gtag("config", "<%= forCrowd.Backbone.Framework.AppSettings.GoogleAnalyticsTrackingID %>");
    </script>
</head>
<body>
    <header>
        <h1>Backbone API
        </h1>
    </header>
    <p>
        <!--TODO Create sort of api help page?-->
    </p>
    <footer>
        <p>
            <span><%= System.Diagnostics.FileVersionInfo.GetVersionInfo(Reflection.Assembly.GetAssembly(New forCrowd.Backbone.WebApi.Controllers.Api.WebApiInfo().GetType()).Location).ProductVersion %></span>
        </p>
        <p>
            <a href="https://forcrowd.org" target="_blank">forCrowd Foundation</a>
        </p>
    </footer>
</body>
</html>
