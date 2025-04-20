package com.alegria.golfwebapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

// Clase que representa la tabla "campo" en la base de datos.
@Entity
public class Campo {

    @Id // Clave primaria de la tabla.
    private int hoyo;

    private int par; // Representa el par del hoyo.

    public int getHoyo() {
        return hoyo;
    }

    public void setHoyo(int hoyo) {
        this.hoyo = hoyo;
    }

    public int getPar() {
        return par;
    }

    public void setPar(int par) {
        this.par = par;
    }
}