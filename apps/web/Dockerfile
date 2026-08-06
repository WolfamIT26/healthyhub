FROM node:22-alpine

WORKDIR /app

ARG VITE_APP_NAME=HealthyHub
ARG VITE_API_BASE_URL=http://localhost:3001/api/v1
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY apps/web/package*.json apps/web/
COPY packages/shared-types/package*.json packages/shared-types/
COPY packages/shared-utils/package*.json packages/shared-utils/
COPY packages/shared-config/package*.json packages/shared-config/

RUN npm ci

COPY . .

RUN npm run build:packages && npm run build:web

EXPOSE 3000

CMD ["npm", "run", "preview", "--workspace", "@healthyhub/web"]
