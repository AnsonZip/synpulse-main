FROM node:13

# RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . .

RUN npm i
RUN npm run build
CMD [ "npm", "start" ]
EXPOSE 8080

# RUN yarn install
# RUN yarn run build
# CMD [ "yarn", "start" ]