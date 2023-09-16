FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci --omit=dev

# assert that the dist folder exists
RUN if [ ! -d "dist" ]; then \
  echo "dist folder does not exist"; \
  exit 1; \
fi

EXPOSE 3000

CMD ["npm", "run", "start:prod", "--silent"]
