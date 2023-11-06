FROM node:15 as builder

WORKDIR /build
COPY babel.config.js modernizr-config.json package.json package-lock.json vue.config.js ./
COPY src ./src
COPY public ./public
RUN npm i
RUN npm run electron:build

FROM scratch
COPY --from=builder /build/dist_electron/*.snap /