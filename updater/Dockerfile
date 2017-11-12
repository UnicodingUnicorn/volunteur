FROM node:latest

WORKDIR /app
ADD . /app

RUN npm install

CMD ["./wait-for-it.sh", "redis:6379", "--", "node", "index.js"]
