FROM node:20-alpine

WORKDIR /app

CMD ["sh", "-c", "node script.js < input.txt"]
