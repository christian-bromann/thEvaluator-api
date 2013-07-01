thEvaluator
===========

API for the browser extension and web application of thEvaluator project


# Configure Database

ThEvalutator API is using [MongoDB](http://www.mongodb.org/) to persist and receive data. Minor
configurations are necessary before starting the API application.

```shell
// start mongod
$ /usr/local/mongodb/bin/mongod

// open new terminal window and start mongo
$ mongo

// create a data collection
> db.createCollection("thEvaluator")

// switch to collection
> use thEvaluator

// create user
> db.addUser("username", "password")
```

After doing this, define these values in your `config.json` file in the `db` object for your
enviroment.


# Start API Servive

To run this app as a service for your server, I recommend to use [Forever](https://github.com/nodejitsu/forever)
from nodejitsu for managing node apps to run continuously. First, download it via NPM:

```shell
$ [sudo] npm install forever -g
```

After this you can start thEvaluator API app with Forever. Add a enviroment parameter to start the service
with your desired settings, set in your config.json:

```shell
$ forever start index.js prod
```