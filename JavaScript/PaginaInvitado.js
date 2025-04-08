let map;
let polyline;
let path = [];
let distanceDiv; // Variable para el elemento donde mostraremos la distancia
let userMarker; // Marcador para la ubicación del usuario
let watchId;    // ID para rastrear la suscripción de watchPosition

function initMap() {
    map = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 15, // Nivel de zoom inicial
        center: { lat: 0, lng: 0 }, // Centro inicial
        mapTypeId: 'satellite', // Inicia con la vista de satélite
        disableDefaultUI: true, // Oculta la mayoría de los controles predeterminados
        zoomControl: true,    // Muestra el control de zoom
        panControl: true,     // Muestra el control de pan (movimiento)
        streetViewControl: false, // Oculta el control de Street View
        mapTypeControl: false, // Oculta el control de tipo de mapa
        fullscreenControl: false // Oculta el control de pantalla completa
    });

    // Inicializa el elemento para mostrar la distancia si existe
    distanceDiv = document.getElementById('distance');
    if (!distanceDiv) {
        distanceDiv = document.createElement('div');
        distanceDiv.id = 'distance';
        map.getDiv().appendChild(distanceDiv);
        distanceDiv.style.backgroundColor = 'white';
        distanceDiv.style.padding = '10px';
        distanceDiv.style.position = 'absolute';
        distanceDiv.style.bottom = '10px';
        distanceDiv.style.left = '10px';
        distanceDiv.style.zIndex = '100'; // Asegura que esté sobre el mapa
    }

    // Intenta obtener y observar la ubicación del usuario en tiempo real
    if (navigator.geolocation) {
        const locationOptions = {
            enableHighAccuracy: true, // Solicita la ubicación más precisa posible
            timeout: 10000,          // Tiempo máximo para la primera obtención de ubicación
            maximumAge: 0             // No usar ubicaciones en caché
        };
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);

                // Si el mapa aún no está centrado en la ubicación inicial, hazlo
                if (!map.getCenter().equals(userLatLng) && !userMarker) {
                    map.setCenter(userLatLng);
                    // Añade el marcador del usuario la primera vez
                    userMarker = new google.maps.Marker({
                        position: userLatLng,
                        map: map,
                        title: 'Mi ubicación'
                    });
                } else if (userMarker) {
                    // Actualiza la posición del marcador si ya existe
                    userMarker.setPosition(userLatLng);
                }
            },
            (error) => {
                handleLocationError(true, map.getCenter(), error);
            },
            locationOptions
        );
    } else {
        // El navegador no soporta la geolocalización
        handleLocationError(false, map.getCenter());
    }

    // Añade un listener para el botón de centrar
    const centerButton = document.getElementById('centrarMapa');
    if (centerButton) {
        centerButton.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
                        map.setCenter(userLatLng);
                        if (userMarker) {
                            userMarker.setPosition(userLatLng);
                        } else {
                            userMarker = new google.maps.Marker({
                                position: userLatLng,
                                map: map,
                                title: 'Mi ubicación'
                            });
                        }
                    },
                    (error) => {
                        handleLocationError(true, map.getCenter(), error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                handleLocationError(false, map.getCenter());
            }
        });
    }

    // Añade un listener para los clics en el mapa para medir distancias
    map.addListener('click', (mapsMouseEvent) => {
        addLatLng(mapsMouseEvent.latLng);
    });

    // Inicializa la polyline para la medición
    polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });
}

function addLatLng(latLng) {
    path.push(latLng);
    polyline.setPath(path);

    if (path.length > 1) {
        calculateDistance();
    }
}

function calculateDistance() {
    let totalDistanceMeters = 0;
    for (let i = 0; i < path.length - 1; i++) {
        totalDistanceMeters += google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1]);
    }

    // Convertir metros a yardas (1 metro ≈ 1.09361 yardas)
    const totalDistanceYards = (totalDistanceMeters * 1.09361).toFixed(2);
    distanceDiv.textContent = `Distancia total: ${totalDistanceYards} yd`;
}

function handleLocationError(browserHasGeolocation, pos, error = null) {
    let errorMessage = browserHasGeolocation
        ? "Error: El servicio de geolocalización falló."
        : "Error: Tu navegador no soporta geolocalización.";
    if (error) {
        errorMessage += ` Código: ${error.code}, Mensaje: ${error.message}`;
    }
    const infoWindow = new google.maps.InfoWindow({
        content: errorMessage,
    });
    infoWindow.setPosition(pos);
    infoWindow.open(map);
}

// Importante: Detener el seguimiento de la ubicación cuando la página se va a cerrar o navegar fuera (alternativa a unload)
window.addEventListener('beforeunload', function() {
    if (navigator.geolocation && watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});