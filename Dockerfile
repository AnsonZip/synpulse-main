FROM node:13

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . .

RUN npm ci
RUN npm run build

CMD [ "npm", "start" ]