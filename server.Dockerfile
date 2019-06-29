FROM node

# Create app directory
WORKDIR /usr/Server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY Server/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY /Server .

# for typescript
RUN npm run tsc

WORKDIR ./build

CMD node main.js