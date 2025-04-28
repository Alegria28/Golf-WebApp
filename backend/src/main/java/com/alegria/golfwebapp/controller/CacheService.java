package com.alegria.golfwebapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.cache.Cache;

// Marca una clase como componente de servicio, lo que la hace apta para la inyección de dependencias y permite que Spring gestione su ciclo de vida. 
// Las clases de servicio suelen contener métodos que implementan operaciones empresariales específicas, a menudo relacionadas con el procesamiento de datos, la validación o la interacción con otros servicios o repositorios.
@Service
public class CacheService {

    private static final String NOMBRE_CACHE = "miCache";

    @Autowired
    private CacheManager cacheManager;

    public void almacenarPuntaje(int hoyo, int puntaje) {
        Cache cache = cacheManager.getCache(NOMBRE_CACHE);
        if (cache != null) {
            // Usa el número del hoyo como clave y el puntaje como valor
            cache.put(hoyo, puntaje);

            // Recupera el valor almacenado
            Integer cachedPuntaje = cache.get(hoyo, Integer.class);
            System.out.println("Puntaje en cache para " + hoyo + ": " + cachedPuntaje);
        } else {
            System.out.println("Cache '" + NOMBRE_CACHE + "' no encontrado");
        }
    }

    public Integer recuperarPuntaje(int hoyo) {
        Cache cache = cacheManager.getCache(NOMBRE_CACHE);
        if (cache != null) {
            // Recupera el valor requerido
            Integer cachedPuntaje = cache.get(hoyo, Integer.class);
            if (cachedPuntaje != null) {
                System.out.println("Puntaje obtenido: " + cachedPuntaje);
                return cachedPuntaje;
            } else {
                System.out.println("No hay ningún puntaje para este hoyo");
            }
        } else {
            System.out.println("Cache '" + NOMBRE_CACHE + "' no encontrado");
        }

        return null;
    }
}
