# 👷🏻 BUILD FOR LOCAL DEVELOPMENT

FROM node:18-alpine As development

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci

COPY --chown=node:node . .

USER node
