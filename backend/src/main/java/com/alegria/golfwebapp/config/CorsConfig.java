package com.alegria.golfwebapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Configuración de CORS para permitir solicitudes desde dominios específicos.
@Configuration
public class CorsConfig {

    // Este método define un bean que configura las reglas de CORS.
    // Un bean es un objeto administrado por Spring que se puede usar en toda la aplicación.
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Configura las reglas de CORS para las rutas que comienzan con "/api/**".
                registry.addMapping("/api/**")
                        // Permite solicitudes desde los siguientes orígenes (dominios permitidos).
                        .allowedOrigins("http://127.0.0.1:5500", "http://localhost:3000")
                        // Especifica los métodos HTTP permitidos para las solicitudes.
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Permite todos los encabezados en las solicitudes.
                        .allowedHeaders("*")
                        // Permite el uso de credenciales (como cookies o tokens de autenticación).
                        .allowCredentials(true);
            }
        };
    }
}