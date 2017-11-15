FROM node:latest
ENV ORGANISERS_PORT 10205

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE $ORGANISERS_PORT

CMD ["./wait-for-it.sh", "redis:6379", "--", "node", "index.js"]
