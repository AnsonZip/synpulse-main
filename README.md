# synpulse

To start this project, please install package first
$ npm install

To start this project in local environment:
$ npm run watch

This project is docker ready, please kindly build and run 
$ docker build -t demo .
$ docker run -dp 8080:8080 demo

There maybe error message when install package, so please use docker to start local environment.

This project support swagger ui, the url:
localhost:8080/api-docs

For sample Bearer Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6IlAtMDEyMzQ1Njc4OSIsIm5hbWUiOiJBbnNvbiIsImlhdCI6MTY0NTg0ODI1NX0.gkcRMqL0K7CVLN2zgqZG4hPDs46A41pDzXvZveBOP-Y

Kafka is set by /config/dev.config.ts which will connect to kakfa in confluent cloud 



