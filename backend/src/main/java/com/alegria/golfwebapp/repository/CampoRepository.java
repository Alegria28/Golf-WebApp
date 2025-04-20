package com.alegria.golfwebapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.alegria.golfwebapp.model.*;

// Interfaz para interactuar con la base de datos de la entidad "Campo".
public interface CampoRepository extends JpaRepository<Campo, Integer> {
    // Hereda métodos predefinidos para operaciones CRUD y consultas.
}