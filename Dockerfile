FROM node:20-alpine

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml prisma/schema.prisma ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000:3000

CMD [ "npm","start" ]