FROM node:13-alpine AS frontend

RUN mkdir /frontend
WORKDIR /frontend

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./ ./
RUN npm install
RUN npm run build

RUN mkdir -p /vol/www/media && \
    mkdir -p /vol/www/static && \
    adduser -D user && \
    chown -R user:user /vol/ && \
    chmod -R 755 /vol/www

USER user

VOLUME /vol/www