package com.alegria.golfwebapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Marca esta clase como el punto de entrada principal de la aplicación Spring Boot.
@SpringBootApplication
public class GolfwebappApplication implements CommandLineRunner {

    // Inyección de dependencia: Spring se encarga de inicializar y proporcionar una instancia de PruebaServidor.
    // Esto permite usar los métodos de PruebaServidor sin necesidad de inicializarlo manualmente.
    @Autowired
    private PruebaServidor pruebaServidor;

    // Método principal de la aplicación. Es el punto de entrada estándar de cualquier aplicación Java.
    // Aquí se utiliza SpringApplication.run para iniciar el contexto de Spring y la aplicación.
    public static void main(String[] args) {
        SpringApplication.run(GolfwebappApplication.class, args);
    }

    // Este método se ejecuta automáticamente después de que la aplicación Spring Boot ha iniciado completamente.
    // Implementa la interfaz CommandLineRunner, lo que permite ejecutar lógica adicional al inicio de la aplicación.
    @Override
    public void run(String... args) throws Exception {
        // Llama al método probarConexion() de la clase PruebaServidor.
        // Este método probablemente verifica la conexión con un servidor o base de datos.
        pruebaServidor.probarConexion();
    }
}