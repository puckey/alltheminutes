FROM node:lts-alpine
ENV NODE_ENV \
    TWITTER_API_KEY \
    TWITTER_API_KEY_SECRET \
    ACCESS_TOKEN \
    ACCESS_TOKEN_SECRET \
    TWITTER_USER_ID
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "app.js"]
