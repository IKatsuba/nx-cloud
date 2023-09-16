FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start:prod", "--silent"]
