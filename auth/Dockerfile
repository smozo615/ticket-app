# Base image
FROM node:18-alpine

# Install dependencies
WORKDIR /app
COPY package.json .
RUN npm i --only=prod
COPY . .

# Command
CMD ["npm", "start"]