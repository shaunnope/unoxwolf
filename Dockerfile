FROM node:lts-slim AS base

# Create app directory
WORKDIR /usr/src

RUN apt-get update -y && apt-get install -y openssl

RUN corepack enable

FROM base AS builder

# Files required by npm install
COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# Type check app
RUN yarn typecheck

FROM base AS runner

# Bundle app source
COPY . .

# Install only production app dependencies
RUN yarn install && yarn cache clean

USER node

# Start the app
EXPOSE 80
CMD ["yarn", "start:force"]
