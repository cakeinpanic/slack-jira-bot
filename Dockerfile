FROM node:carbon

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY ./ /app

EXPOSE 5000
CMD ["node", "index.js"]