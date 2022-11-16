# Base image
FROM node:18-alpine

# Install dependencies
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .

# Command
CMD ["npm","run", "dev"]