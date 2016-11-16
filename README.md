# Jira Capture Logs

Cette librairie permet de récupérer des informations supplémentaires via la Jira Capture.

Les informations récupérées lors de la capture vont permettre de connaitre les actions utilisateur ainsi que les codes HTTP des API appelées.

## Fonctionnement

La librairie est articulée autour de **4 composants**:
* **Provider** `jiraCaptureLogsSettings`, qui permet d'initialiser les données essentielles au fonctionnement de la librairie
* **Intercepteur HTTP** `jiraCaptureLogsHttpInterceptor` pour recupérer les codes HTTP des requêtes
* **Service** `jiraCaptureLogs` pour récuperer et distribuer les données recoltés par l'intercepteur.
* **Directive** `<jira-capture-logs>`, qui va permettre d'ajouter une div cachée dans laquelle les informations recoltés par l'interceptor et le service vont être affichés.

## Installation

(Instructions d'installation via nexus/bower)

## Utilisation

### Mise en place
* Ajouter le module `jiraCaptureLogs` à votre application.
* Inclure le fichier minifié jira-capture-logs.min.js ou jira-capture-logs.js

### Directive
* Inclure la directive `jira-capture-logs` à la base de votre ng-view.
* Passer dans l'attribut `user-is-logged` l'information qui permet de vérifier que l'utilisateur est connecté.
* Passer dans l'attribut `user-login` le login de l'utilisateur connecté.

```html
<div ng-view></div>
<jira-capture-logs user-is-logged="user.isLogged" user-login="user.login"></jira-capture-logs>
```

### Configuration
Dans un fichier de config, faire appel au provider `jiraCaptureLogsSettingsProvider` pour définir: 
* L'ID à récuperer lors de la Jira Capture
* Le versionning de votre app ou l'url du ws pour récupérer le versionning.
* Les url des api appelées par l'application
* Le nombre max d'informations technique
* Le nombre max d'informations d'actions utilisateur

```javascript
angular.module('app')
    .config(function(jiraCaptureLogsSettingsProvider) {
    	/**
        * @desc Versionning of the app.
        * @param {string} url/version
        * @param {boolean} http call - optional
        */
        jiraCaptureLogsSettingsProvider.setUrlAppVersion('api/info', true);

        /**
        * @desc ID to allow Jira to get the div with the logs, configure in Jira.
        * @param {string}
        */
        jiraCaptureLogsSettingsProvider.setId('jiraCaptureID');
        
        /**
        * @desc Url of the API
        * @param {array}
        */
        jiraCaptureLogsSettingsProvider.setApiName(['api-sp', 'api-edit']);
        
        /**
        * @desc Length of the array tech logs
        * @param {int} - 10
        */
        jiraCaptureLogsSettingsProvider.setTechLogsLength(20);
        
        /**
        * @desc Length of the array user logs 
        * @param {int} - 5
        */
        jiraCaptureLogsSettingsProvider.setUserLogsLength(10);
    });
```

### Service
Pour ajouter ou récupérer des logs manuellement. Utiliser le service `jiraCaptureLogs`

#### Action Utilisateur
##### Ajouter des logs d'actions utilisateur
```javascript
/**
* @desc Register a user action.
* @param {string} data user action.
*/
jiraCaptureLogs.addUserHistoryLog('click on this button');
```

##### Récuperer les logs d'actions utilisateur
```javascript
/**
* @desc get user action.
* @return {array}
*/
jiraCaptureLogs.getUserHistoryLog();
```


#### Action Technique
##### Ajouter des logs d'actions technique
```javascript
/**
* @desc Register a technical action (API call and responses).
* @param {string} data technical action.
*/
jiraCaptureLogs.addUserHistoryLog('error API');
```

##### Récuperer les logs d'actions technique
```javascript
/**
* @desc get tech action.
* @return {array}
*/
jiraCaptureLogs.getUserHistoryLog();
```

### Exemple

```html
Version API SP: 1.16.3-SNAPSHOT

Utilisateur actuellement non identifié.

Derniers événements techniques:

* 16/11/2016 à 15:49:37.626 - appel API : POST /api-sp/oauth/token
* 16/11/2016 à 15:49:37.915 - réponse API : POST /api-sp/oauth/token, code 200
* 16/11/2016 à 15:49:37.916 - appel API : GET /api-sp/subscriber/profile
* 16/11/2016 à 15:49:38.127 - réponse API : GET /api-sp/subscriber/profile, code 200
* 16/11/2016 à 15:49:38.281 - appel API : GET /api-edit/kiosque?sort=parutionDate,desc
* 16/11/2016 à 15:49:38.384 - réponse API : GET /api-edit/kiosque?sort=parutionDate,desc, code 200
* 16/11/2016 à 16:09:38.743 - appel API : POST /api-sp/oauth/token
* 16/11/2016 à 16:09:39.267 - réponse API : POST /api-sp/oauth/token, code 200
* 16/11/2016 à 16:09:57.725 - appel API : GET /api-sp/disconnection/app/subscriber
* 16/11/2016 à 16:09:57.807 - réponse API : GET /api-sp/disconnection/app/subscriber, code 200
```
