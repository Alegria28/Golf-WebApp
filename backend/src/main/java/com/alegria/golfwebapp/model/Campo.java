package com.alegria.golfwebapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Clase que representa la tabla "campo" en la base de datos.
@Entity
@Table(name = "campo")
public class Campo {

    @Id // Clave primaria de la tabla.
    @Column(name = "hoyo")
    private int hoyo;

    @Column(name = "par")
    private int par; // Representa el par del hoyo.

    // Atributos que representan el centro del green según el hoyo
    @Column(name = "greenlatitud")
    private double greenlatitud;
    @Column(name = "greenlongitud")
    private double greenlongitud;

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

    public double getGreenLatitud() {
        return greenlatitud;
    }

    public void setGreenLatitud(double greenlatitud) {
        this.greenlatitud = greenlatitud;
    }

    public double getGreenLongitud() {
        return greenlongitud;
    }

    public void setGreenLongitud(double greenlongitud) {
        this.greenlongitud = greenlongitud;
    }
}