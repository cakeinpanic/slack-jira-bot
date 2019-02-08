FROM node:carbon

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY ./ /app

RUN mv _config.js config.js

EXPOSE 5000
CMD ["node", "index.js"]