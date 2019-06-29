# base image
FROM node

# set working directory
RUN mkdir /usr/src/AnalyzerClient
WORKDIR /usr/src/AnalyzerClient

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/AnalyzerClient/node_modules/.bin:$PATH

# install and cache app dependencies
COPY AnalyzerClient/package.json /usr/src/AnalyzerClient/package.json
RUN npm install --silent
RUN npm install -g @angular/cli@7.3.9

COPY AnalyzerClient/ /usr/src/AnalyzerClient/

# start app
CMD ng serve --host 0.0.0.0