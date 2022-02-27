FROM node:13

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . .

RUN yarn install
RUN yarn run build

CMD [ "yarn", "start" ]