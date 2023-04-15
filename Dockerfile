FROM node:19-alpine3.16


WORKDIR /app/files

EXPOSE 5656

COPY package*.json .

COPY cat*.jpg .

COPY giant*.png .

COPY index.html .

COPY main.js .

COPY *.mp4 .

RUN npm install

CMD ["npm","run","start"]


