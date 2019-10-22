FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --save-dev
COPY . .
EXPOSE 8080
CMD ["npm", "run dev"]