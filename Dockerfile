FROM node:20-bullseye-slim

ARG PORT=3000

RUN apt-get update
RUN apt-get -y install sispmctl
RUN chmod u+s /usr/bin/sispmctl

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN echo "PORT=$PORT" > .env

RUN npm run build

CMD [ "node", "dist/main.js" ]

EXPOSE $PORT
