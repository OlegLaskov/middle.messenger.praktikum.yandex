FROM node:16

WORKDIR /app

COPY /dist .

RUN npm i express

EXPOSE 3000

CMD ["node", "server.js"]
