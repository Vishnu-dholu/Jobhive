# Stage 1: Build the JAR file
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application and skip tests for speed
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: Run the JAR file
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar
# Create uploads directory
RUN mkdir -p uploads

# Expose port 8080
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]