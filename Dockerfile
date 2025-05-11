FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173
EXPOSE 3001

CMD ["npm", "run", "dev", "--", "--host"]