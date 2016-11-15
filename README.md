# Jira Capture Logs

Cette librairie permet de recuperer des informations liées aux requetes de Web Services via Jira Capture.
Les informations récuperées lors de la capture vont permettre de connaitre les actions utilisateurs ainsi que les codes réponses des web services appelés.

## Fonctionnement
decrire fonctionnement

## Getting Started

(Instructions d'installation via nexus)

### Installing
```
Ajouter le module 'jiraCaptureLogs'
Inclure le fichier minifié jira-capture-logs.min.js dans l'index.html
Inclure la directive <jira-capture-logs></jira-capture-logs> a la base de votre ng-view
exemple 	<div ng-view=""></div>
            <jira-capture-logs user-info="user"></jira-capture-logs>
Passer dans le callback "user-info" un objet contenant les informations de l'utilisateur. L'objet doit contenir la valeur isLogged.

```
Définir un dans un fichier de config les url des ws, l'id a recuperer lors du jira capture, ainsi que le versionnnig de votre app.
Faire appel au provider jiraCaptureLogsSettingsProvider
// faire appel ws dynamic avec boolean
```
'use strict';

angular.module('laPosteApp')
    .config(function (jiraCaptureLogsSettingsProvider, ApiConfig) {
        jiraCaptureLogsSettingsProvider.setUrlAppVersion(ApiConfig.API_SP + '/info');
        jiraCaptureLogsSettingsProvider.setId('contexteDifyz');
        jiraCaptureLogsSettingsProvider.setApiName([ApiConfig.API_EDITOR, ApiConfig.API_SP]);
    });
```
