FROM node:latest

RUN apt-get update
RUN apt-get -y install sispmctl
RUN chmod u+s /usr/bin/sispmctl

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]

EXPOSE 3000