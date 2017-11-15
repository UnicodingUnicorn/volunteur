FROM node:latest
ENV VOLUNTEERS_PORT 10202

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE $VOLUNTEERS_PORT

CMD ["./wait-for-it.sh", "redis:6379", "--", "node", "index.js"]
