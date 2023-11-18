FROM node:16-alpine as build-image

WORKDIR /app

RUN apk add --no-cache make gcc g++ python3

COPY *.json yarn.lock ./

COPY src /app/src

RUN yarn && yarn build

FROM node:16-alpine

WORKDIR /app
COPY --from=build-image /app  ./

CMD [ "yarn", "start" ]