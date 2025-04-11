FROM openjdk:22-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar cualquier archivo .jar desde la carpeta build/libs
COPY build/libs/*.jar app.jar

# Exponer el puerto en el que corre Spring Boot
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
