FROM node:13-alpine AS frontend

RUN mkdir /frontend
WORKDIR /frontend

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./ ./
RUN npm install

RUN npm run build