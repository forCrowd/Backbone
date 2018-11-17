# Backbone

[![Twitter Follow](https://img.shields.io/twitter/follow/forCrowd.svg?style=social)](https://twitter.com/forCrowd)
[![Join the chat at https://gitter.im/forCrowd/Backbone](https://badges.gitter.im/forCrowd/Backbone.svg)](https://gitter.im/forCrowd/Backbone?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An API service for rapid app prototyping

## Current Stack

### Server

* .NET Framework 4.6
* ASP.NET Web API 2 & OData v3
* Entity Framework 6
* SQL Server 2014

### Client

* Angular 6.x
* TypeScript 2.x
* BreezeJS
* Karma & Jasmine

## Setup

Follow this document to setup the application: [Getting Started](https://github.com/forcrowd/Backbone/wiki/Getting-Started)

## Deployment

### Server (WebAPI)

To deploy WebAPI application, you can use **Publish** feature in **Visual Studio**.  

Only remark is, configuration files are excluded from deploy operation (**Build Action: 'None'**).  

When deploying the project, update following configuration files with your own settings and manually copy them to your server:
* WebApi\Configs\\*.config

To make the application offline during the deployment, you can use `_app_offline.htm`.

### Client (AngularClient)

AngularClient is a **Angular CLI** project.

For deployment, there are **test** and **production** as an additional environments.

You can use the local settings file as a base to create your own **test** and **prod** configuration files:

    AngularClient\src\settings\settings.ts

To prepare a production bundle by generating sourcemap files, run the following on your command console:

    ng build --prod

For more options, please visit [Angular CLI](https://github.com/angular/angular-cli)

## Contribute

Our project is, without any discrimination, open to anyone who is willing to make a contribution!  

To learn more about our community rules: [Code of Conduct](/CODE_OF_CONDUCT.md)

### First Mission: Contributors Page

We created an experimental attempt to help you to get familiar with our project and make your first pull request.

Follow this document for detailed instructions: [First Mission](https://github.com/forCrowd/Backbone/wiki/First-Mission)

## Changelog

To see the changes in our project: [Changelog](/CHANGELOG.md)

## License

Our project is licensed under [MIT license](/LICENSE).

You are free to use, modify and distribute it, even in commercial activities.
