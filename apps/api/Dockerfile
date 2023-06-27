FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci && \
    npx nx build api --configuration=production && \
    npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start", "--silent"]
