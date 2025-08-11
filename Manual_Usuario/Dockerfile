FROM node:22.12.0 AS base

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npx", "docusaurus", "start", "--host", "0.0.0.0"]

#docker build -t docusaurus-dev .
#docker run --rm -it -p 3000:3000 -v ${PWD}:/usr/src/app docusaurus-dev