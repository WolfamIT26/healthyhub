FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY apps/web/package*.json apps/web/
COPY packages/shared-types/package*.json packages/shared-types/
COPY packages/shared-utils/package*.json packages/shared-utils/
COPY packages/shared-config/package*.json packages/shared-config/

RUN npm ci

COPY . .

RUN npm run build:packages && npm run build:api

EXPOSE 3001

CMD ["npm", "run", "start:prod", "--workspace", "@healthyhub/api"]
