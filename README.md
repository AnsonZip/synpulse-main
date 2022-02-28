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


Task that planned to do:
1. Support deploying to Kubernetes 
2. Add unit test
3. Change the way to load config file. Now it is store in the code but of coz it is now a good way.
   Would like to use dotenv for supporting multi environment and for docker environment.
4. For Kafka, my original plan will be serperate user account currency into different topic.
   And when consume, I can parallel to consume topic and reduce number of transactions per topic.
   But there is some issue, so I just consume them all.
5. For security, I have implement JWT token on it. 
   But there maybe some logic for authorization that can be implement on it. 
6. For Data access / efficient, it is same as point 4.
