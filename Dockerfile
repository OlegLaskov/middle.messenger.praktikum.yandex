FROM node

WORKDIR /app

COPY /dist .

EXPOSE 3000

CMD ["node", "server.js"]
