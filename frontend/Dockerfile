FROM node:13-alpine AS frontend

RUN mkdir /frontend
WORKDIR /frontend

COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json
COPY ./frontend ./
RUN npm install

RUN npm run build