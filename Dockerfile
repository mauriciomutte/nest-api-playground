# 👷🏻 BUILD FOR LOCAL DEVELOPMENT

FROM node:18-alpine As development

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

USER node

## 🏗️ BUILD FOR PRODUCTION

FROM node:18-alpine As build

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

# 📦 PRODUCTION

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
