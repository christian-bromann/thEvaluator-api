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
$ /usr/local/mongodb/bin/mongo

// create a data collection
> db.createCollection("thEvaluator")

// switch to collection
> use thEvaluator

// create user
> db.addUser("username", "password")
```

After doing this, define these values in your `config.json` file in the `db` object for your
enviroment.