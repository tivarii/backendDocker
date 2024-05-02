FROM node:20


WORKDIR /app

COPY package*.json ./

RUN npm install --save-dev typescript

RUN npm install

COPY . .

RUN npm run build # or tsc -b

EXPOSE 3001
CMD ["npm", "run", "dev"]