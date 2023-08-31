FROM node:lts-slim AS base

# Create app directory
WORKDIR /usr/src

FROM base AS builder

# Files required by npm install
COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install \
    --non-interactive \
    --production=false

# Bundle app source
COPY . .

# Type check app
RUN yarn typecheck

FROM base AS runner

# Bundle app source
COPY . .

# Install only production app dependencies
RUN yarn install \
    --non-interactive \
    --production=true && yarn cache clean

USER node

# Start the app
EXPOSE 80
CMD ["npm", "run", "start:force"]
