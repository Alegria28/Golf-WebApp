package com.alegria.golfwebapp.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Habilita la funcionalidad de caché en la aplicación
@EnableCaching
@Configuration
public class CaffeineCacheConfig {

  // Configuración del bean de Caffeine, que define las propiedades del caché
  @Bean
  public Caffeine<Object, Object> caffeineConfig() {
    // Configura un builder de Caffeine con sus propiedades propiedades
    return Caffeine.newBuilder()
        .maximumSize(1000);
  }

  // Configuración del CacheManager que utiliza Caffeine como proveedor de caché
  @Bean
  public CacheManager cacheManager(Caffeine caffeine) {
    // Crea una instancia de CaffeineCacheManager con un caché llamado "miCache"
    CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager("miCache");

    // Asigna la configuración de Caffeine al CacheManager
    caffeineCacheManager.setCaffeine(caffeine); 

    // Devuelve el CacheManager configurado
    return caffeineCacheManager;
  }
}