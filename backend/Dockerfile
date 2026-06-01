FROM node:18-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# install dependencies
COPY package*.json ./
RUN npm ci --only=production

# copy sources
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
