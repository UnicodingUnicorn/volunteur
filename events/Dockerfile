FROM node:latest
ENV EVENTS_PORT 10203

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE $EVENTS_PORT

CMD ["./wait-for-it.sh", "redis:6379", "--", "node", "index.js"]
