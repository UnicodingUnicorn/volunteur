FROM node:latest
ENV FILESERVE_PORT 10204

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE $FILESERVE_PORT

CMD ["./wait-for-it.sh", "minio:9000", "--", "node", "index.js"]
