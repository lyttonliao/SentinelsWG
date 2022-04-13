FROM node:13-alpine

RUN mkdir /frontend
WORKDIR /frontend
# COPY ./scripts /scripts
# RUN chmod +x /scripts/*

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY ./ ./
RUN npm install

# ENV PATH="./node_modules/.bin:${PATH}"
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app

RUN npm run build
# CMD ["entrypoint.sh"]
