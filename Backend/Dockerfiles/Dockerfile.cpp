FROM gcc:latest

COPY ./Languages/cpp-runner.cpp /app/main.cpp
COPY ./Languages/input.txt /app/input.txt

WORKDIR /app
RUN g++ main.cpp -o main

CMD ["sh","-c","./main < input.txt"]
