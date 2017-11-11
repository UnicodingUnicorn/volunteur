# updater

The updater service is responsible for checking the lifetime of each event, archiving each event when it ends. Furthermore, it is responsible for updating the scores of each user. In addition to redis, it uses couchdb for archiving purposes.

This service polls the database every minute.

The updater service is not an API, and hence is not open at any port.
