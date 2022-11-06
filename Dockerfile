FROM node:18-alpine

WORKDIR ./app

COPY package*.json .

RUN npm install
RUN npm install ffmpeg
COPY . .
CMD ["node", "index.js"]
