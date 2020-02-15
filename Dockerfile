FROM node:lts-alpine

ENV PORT 8080
EXPOSE 8080

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "yarn", "run", "start" ]