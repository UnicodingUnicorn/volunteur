FROM node:latest

WORKDIR /app
ADD . /app

RUN npm install

CMD ["./wait-for-it.sh", "couchdb:5984", "--", "./wait-for-it.sh", "redis:6379", "--", "node", "index.js"]
