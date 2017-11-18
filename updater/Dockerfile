FROM node:latest
ENV UPDATES_PORT 10206

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE $UPDATES_PORT

CMD ["./wait-for-it.sh", "redis:6379", "--", "node", "index.js"]
