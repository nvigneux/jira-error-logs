# Jira Capture Logs

Cette librairie permet de recuperer des informations liées aux requetes de l'API via Jira Capture.

Les informations récuperées lors de la capture vont permettre de connaitre les actions utilisateurs ainsi que les codes http des web services appelés.

## Fonctionnement

(Décrire le fonctionnement)

## Installation

(Instructions d'installation via nexus)

## Utilisation

### Mise en place
* Ajouter le module `jiraCaptureLogs` a votre projet.
* Inclure le fichier minifié jira-capture-logs.min.js ou jira-capture-logs.js

### Directive
* Inclure la directive <jira-capture-logs></jira-capture-logs> a la base de votre ng-view.
* Passer dans le callback "user-info" un objet contenant les informations de l'utilisateur. L'objet doit contenir la valeur isLogged.

```html
<div ng-view></div>
<jira-capture-logs user-info="user"></jira-capture-logs>
```

### Configuration
Dans un fichier de config, faite appel au provider `jiraCaptureLogsSettingsProvider` pour définir: 
* Les url des api appelées par l'application
* L'id a récuperer lors de la Jira Capture
* Le versionning de votre app ou l'url du ws pour récupérer le versionning.

```javascript
angular.module('app')
    .config(function(jiraCaptureLogsSettingsProvider) {
    	//Versionning de l'app
        jiraCaptureLogsSettingsProvider.setUrlAppVersion('api/info');
        //id a recuperer lors du Jira capture
        //a configurer dans Jira
        jiraCaptureLogsSettingsProvider.setId('jiraCaptureID');
        //url des API
        jiraCaptureLogsSettingsProvider.setApiName(['api-sp', 'api-edit']);
    });
```

### Service
Pour ajouter ou récupérer des logs, utiliser le service `jiraCaptureLogs`

#### Actions Utilisateur
##### Ajouter des logs d'actions utilisateur
```javascript
/**
* @desc Register a user action.
* @param {string} data user action.
*/
jiraCaptureLogs.addUserHistoryLog('erreur technique lors appel API');
```

##### Récuperer les logs d'actions utilisateur
```javascript
/**
* @desc get user action.
* @return {array}
*/
jiraCaptureLogs.getUserHistoryLog();
```


#### Actions Technique
##### Récuperer les logs d'actions technique
```javascript
/**
* @desc Register a technical action (API call and responses).
* @param {string} data technical action.
*/
jiraCaptureLogs.addUserHistoryLog('erreur technique lors appel API');
```

##### Récuperer les logs d'actions technique
```javascript
/**
* @desc get tech action.
* @return {array}
*/
jiraCaptureLogs.getUserHistoryLog();
```
