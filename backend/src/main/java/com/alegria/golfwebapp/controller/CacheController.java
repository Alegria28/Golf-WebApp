package com.alegria.golfwebapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Define esta clase como un controlador REST para manejar solicitudes HTTP.
@RequestMapping("/api/cache") // Ruta base para las solicitudes relacionadas con "cache".
public class CacheController {

    @Autowired // Inyección del servicio del cache
    private CacheService cacheService;

    @GetMapping("/{hoyo}")
    public Integer getPuntaje(@PathVariable int hoyo) {
        return cacheService.recuperarPuntaje(hoyo);
    }

    @PostMapping("/{hoyo}/{puntaje}")
    public void setPuntaje(@PathVariable int hoyo, @PathVariable int puntaje) {
        cacheService.almacenarPuntaje(hoyo, puntaje);
    }

}
