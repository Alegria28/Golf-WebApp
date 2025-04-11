package com.alegria.golfwebapp;

import java.sql.Connection;
import java.sql.DriverManager;

public class PruebaServidor {
    public static void main(String[] args) {
        // Definimos la URL de la base de datos MySQL a la que nos vamos a conectar.
        // Esta URL incluye el protocolo JDBC, la dirección del servidor (localhost),
        // el puerto (3306) y el nombre de la base de datos (golfappbd).
        String url = "jdbc:mysql://localhost:3306/golfappbd";
        // Definimos el usuario que se utilizará para la conexión a la base de datos.
        String user = "root";
        // Definimos la contraseña del usuario para la conexión a la base de datos.
        String password = "soloQUERIAunproyecto2812";

        try {
            // Intentamos establecer una conexión con la base de datos.

            // Primero, cargamos el driver de JDBC para MySQL.
            // Esto es necesario para que Java pueda interactuar con la base de datos MySQL.
            Class.forName("com.mysql.cj.jdbc.Driver");
            // Establecemos la conexión utilizando la URL, el usuario y la contraseña definidos anteriormente.
            // DriverManager.getConnection() intenta establecer una conexión con la base de datos.
            Connection connection = DriverManager.getConnection(url, user, password);
            // Si la conexión se establece con éxito, imprimimos un mensaje de confirmación en la consola.
            System.out.println("Conexión exitosa con la base de datos: " + url);
        } catch (Exception e) {
            // Si ocurre alguna excepción durante el proceso de conexión,
            // capturamos la excepción e imprimimos un mensaje de error en la consola.
            System.out.println("Excepción: " + e.getMessage());
        }

    }

}