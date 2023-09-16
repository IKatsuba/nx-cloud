FROM node:18

WORKDIR /app

COPY . .

ENV CI=true

RUN npm ci && \
    npx nx build api --configuration=production && \
    npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start", "--silent"]
