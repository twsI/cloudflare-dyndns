FROM node:lts-alpine

ENV PORT 8080
EXPOSE 8080

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "yarn", "run", "start" ]