FROM openjdk:17

COPY ./Languages/java-runner.java /app/Main.java
COPY ./Languages/input.txt /app/input.txt

WORKDIR /app
RUN javac Main.java

CMD ["sh","-c","java Main < input.txt"]
