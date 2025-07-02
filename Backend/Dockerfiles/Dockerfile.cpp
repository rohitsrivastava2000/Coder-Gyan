FROM gcc:latest

WORKDIR /app

CMD ["sh", "-c", "g++ main.cpp -o main && ./main < input.txt"]
