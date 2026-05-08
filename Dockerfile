FROM node:18.15-alpine

WORKDIR /myapp
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
# RUN npm run build
CMD npm run start:dev

# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# EXPOSE 1000

# CMD ["npm", "run", "start:prod"]
