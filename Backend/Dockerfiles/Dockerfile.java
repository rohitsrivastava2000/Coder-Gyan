FROM openjdk:17

WORKDIR /app

CMD ["sh", "-c", "javac Main.java && java Main < input.txt"]
