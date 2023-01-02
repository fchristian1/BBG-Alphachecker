FROM node:18-slim
WORKDIR /usr/src/app
COPY --chown=node:node ./package*.json ./
RUN npm ci && npm cache clean --force
COPY --chown=node:node . .
RUN npm run build
USER node
CMD ["node", "dist/main.js"]