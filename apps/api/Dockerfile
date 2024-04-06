FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm ci && npx nx build api -c=production

FROM node:20-alpine
WORKDIR /app
COPY . .
COPY --from=build /app/dist/apps/api ./dist/apps/api
RUN npm ci --omit=dev

EXPOSE ${PORT:-3000}
CMD ["npm", "run", "start:prod", "--silent"]
