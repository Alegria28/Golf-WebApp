package com.alegria.golfwebapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.alegria.golfwebapp.repository.*;
import com.alegria.golfwebapp.model.*;
import java.util.Optional;

@RestController // Define esta clase como un controlador REST para manejar solicitudes HTTP.
@RequestMapping("/api/campo") // Ruta base para las solicitudes relacionadas con "campo".
public class CampoController {

    @Autowired // Inyección de dependencias para acceder al repositorio.
    private CampoRepository campoRepository;

    @GetMapping("/{hoyo}") // Maneja solicitudes GET para obtener información de un hoyo específico.
    public Optional<Campo> getHoyo(@PathVariable int hoyo) {
        return campoRepository.findById(hoyo); // Busca el hoyo en la base de datos por su ID.
    }
}