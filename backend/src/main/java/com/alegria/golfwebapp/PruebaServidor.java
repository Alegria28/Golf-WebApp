package com.alegria.golfwebapp;

// Importaciones necesarias para el funcionamiento del código.
import org.springframework.beans.factory.annotation.Value; // Permite inyectar valores desde application.properties.
import org.springframework.stereotype.Component; // Marca esta clase como un componente de Spring.

import java.sql.Connection; // Representa una conexión a la base de datos.
import java.sql.DriverManager; // Proporciona métodos para gestionar conexiones JDBC.

@Component // Marca esta clase como un componente de Spring para que sea detectada
           // automáticamente.
public class PruebaServidor {

    // Inyección de valores desde application.properties.
    // Estas variables almacenan la información necesaria para conectarse a la base
    // de datos.

    @Value("${spring.datasource.url}")
    private String url; // URL de la base de datos (protocolo, host, puerto y nombre de la base de
                        // datos).

    @Value("${spring.datasource.username}")
    private String user; // Nombre de usuario para la conexión a la base de datos.

    @Value("${spring.datasource.password}")
    private String password; // Contraseña del usuario para la conexión a la base de datos.

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName; // Nombre completo de la clase del driver JDBC para MySQL.

    public void probarConexion() {
        try {
            // Carga el driver JDBC para MySQL.
            // Esto es necesario para que Java pueda interactuar con la base de datos MySQL.
            Class.forName(driverClassName);

            // Establece la conexión con la base de datos utilizando los valores inyectados.
            Connection connection = DriverManager.getConnection(url, user, password);

            // Si la conexión es exitosa, imprime un mensaje en la consola.
            System.out.println("Conexión exitosa con la base de datos: " + url);
        } catch (Exception e) {
            // Si ocurre un error durante la conexión, captura la excepción y muestra un
            // mensaje de error.
            System.out.println("Excepción: " + e.getMessage());
        }
    }
}