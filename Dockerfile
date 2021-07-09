FROM node:14-alpine

RUN apk upgrade
RUN apk add curl
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl

# install dependencies
RUN apk update \ && apk add python3-dev
RUN ln -s /usr/bin/python3 /usr/local/bin/python

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]