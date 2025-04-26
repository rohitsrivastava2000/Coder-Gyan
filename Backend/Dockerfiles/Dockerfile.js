FROM node:20-alpine

COPY ./Languages/javascript-runner.js /app/script.js
COPY ./Languages/input.txt /app/input.txt

WORKDIR /app

CMD ["node", "script.js"]
