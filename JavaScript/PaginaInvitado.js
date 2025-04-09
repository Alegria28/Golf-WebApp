let map; // Variable para almacenar la instancia del mapa de Google Maps
let distanceDiv; // Variable para el elemento HTML donde se mostrará la distancia total medida
let userCircle; // Círculo para representar la ubicación del usuario en el mapa
let watchId;    // ID para rastrear la suscripción de watchPosition, necesario para detener el rastreo
let userLocation = null; // Variable para almacenar la ubicación actual del usuario
let polyline = null; // Polyline para dibujar la ruta de medición

// Función principal para inicializar el mapa de Google Maps
function initMap() {
    // Obtiene el elemento HTML donde se insertará el mapa
    const mapDiv = document.getElementById("mapa");

    // Crea una nueva instancia del mapa de Google Maps
    map = new google.maps.Map(mapDiv, {
        zoom: 19, // Establece el nivel de zoom inicial del mapa (más cercano)
        center: { lat: 0, lng: 0 }, // Establece el centro inicial del mapa (latitud y longitud)
        mapTypeId: 'satellite', // Establece el tipo de mapa a vista de satélite
        disableDefaultUI: true, // Oculta la mayoría de los controles predeterminados del mapa
        panControl: true,     // Muestra el control de pan (movimiento) en el mapa
        streetViewControl: false, // Oculta el control de Street View
        mapTypeControl: false, // Oculta el control de tipo de mapa
        fullscreenControl: false // Oculta el control de pantalla completa
    });

    // Inicializa el elemento para mostrar la distancia si existe
    distanceDiv = document.getElementById('distance');
    if (!distanceDiv) {
        // Si no existe un elemento con el ID 'distance', crea uno nuevo
        distanceDiv = document.createElement('div');
        distanceDiv.id = 'distance'; // Asigna el ID 'distance' al nuevo elemento
        map.getDiv().appendChild(distanceDiv); // Agrega el nuevo elemento al contenedor del mapa
        // Aplica estilos al elemento de distancia para que sea visible y esté bien posicionado
        distanceDiv.style.backgroundColor = 'white'; // Establece el fondo blanco
        distanceDiv.style.padding = '10px'; // Añade un relleno de 10px
        distanceDiv.style.position = 'absolute'; // Establece la posición absoluta para colocarlo sobre el mapa
        distanceDiv.style.bottom = '10px'; // Lo coloca en la parte inferior
        distanceDiv.style.left = '10px'; // Lo coloca en la parte izquierda
        distanceDiv.style.zIndex = '100'; // Asegura que esté sobre otros elementos del mapa
    }

    // Intenta obtener y observar la ubicación del usuario en tiempo real
    if (navigator.geolocation) {
        // Define las opciones para la geolocalización
        const locationOptions = {
            enableHighAccuracy: true, // Solicita la ubicación más precisa posible
            timeout: 10000,          // Tiempo máximo para la primera obtención de ubicación (10 segundos)
            maximumAge: 0             // No usar ubicaciones en caché
        };

        // Utiliza watchPosition para obtener la ubicación del usuario de forma continua
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                // Callback que se ejecuta cuando se obtiene una nueva ubicación
                userLocation = {
                    lat: position.coords.latitude, // Obtiene la latitud de la ubicación
                    lng: position.coords.longitude, // Obtiene la longitud de la ubicación
                };
                const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng); // Crea un objeto LatLng con la ubicación del usuario

                // Si el círculo del usuario no existe, créalo; si existe, actualiza su centro
                if (userCircle) {
                    userCircle.setCenter(userLatLng); // Actualiza el centro del círculo existente
                    userCircle.setRadius(calculateCircleRadius()); // Actualiza el radio del círculo
                } else {
                    // Crea un nuevo círculo para representar la ubicación del usuario
                    userCircle = new google.maps.Circle({
                        strokeColor: '#FFFF', // Color del borde del círculo (blanco)
                        strokeOpacity: 1, // Opacidad del borde del círculo
                        strokeWeight: 3, // Grosor del borde del círculo
                        fillColor: '#0000FF', // Color de relleno del círculo (azul claro)
                        fillOpacity: 1, // Opacidad del relleno del círculo
                        map: map, // Asigna el mapa al círculo
                        center: userLatLng, // Establece el centro del círculo en la ubicación del usuario
                        radius: calculateCircleRadius(), // Radio del círculo en metros (ajusta según sea necesario)
                    });
                }
            },
            (error) => {
                // Callback que se ejecuta si hay un error al obtener la ubicación
                handleLocationError(true, map.getCenter(), error); // Llama a la función para manejar el error
            },
            locationOptions // Pasa las opciones de geolocalización
        );
    } else {
        // Si el navegador no soporta la geolocalización
        handleLocationError(false, map.getCenter()); // Llama a la función para manejar el error
    }

    // Añade un listener para el botón de centrar
    const centerButton = document.getElementById('centrarMapa');
    if (centerButton) {
        centerButton.addEventListener('click', () => {
            // Agrega un event listener al botón para centrar el mapa en la ubicación del usuario
            if (navigator.geolocation) {
                // Si el navegador soporta la geolocalización
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Callback que se ejecuta cuando se obtiene la ubicación
                        userLocation = {
                            lat: position.coords.latitude, // Obtiene la latitud de la ubicación
                            lng: position.coords.longitude, // Obtiene la longitud de la ubicación
                        };
                        const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng); // Crea un objeto LatLng con la ubicación del usuario
                        map.setCenter(userLatLng); // Centra el mapa en la ubicación del usuario
                        map.setZoom(19); // Establece el zoom al valor inicial
                        if (userCircle) {
                            userCircle.setCenter(userLatLng); // Actualiza el centro del círculo existente
                        } else {
                            // Crea un nuevo círculo para representar la ubicación del usuario
                            userCircle = new google.maps.Circle({
                                strokeColor: '#0000FF', // Color del borde del círculo (azul)
                                strokeOpacity: 0.8, // Opacidad del borde del círculo
                                strokeWeight: 2, // Grosor del borde del círculo
                                fillColor: '#ADD8E6', // Color de relleno del círculo (azul claro)
                                fillOpacity: 0.4, // Opacidad del relleno del círculo
                                map: map, // Asigna el mapa al círculo
                                center: userLatLng, // Establece el centro del círculo en la ubicación del usuario
                                radius: 10, // Radio del círculo en metros (ajusta según sea necesario)
                            });
                        }
                    },
                    (error) => {
                        // Callback que se ejecuta si hay un error al obtener la ubicación
                        handleLocationError(true, map.getCenter(), error); // Llama a la función para manejar el error
                    },
                    {
                        enableHighAccuracy: true, // Solicita la ubicación más precisa posible
                        timeout: 5000, // Tiempo máximo para la primera obtención de ubicación (5 segundos)
                        maximumAge: 0 // No usar ubicaciones en caché
                    }
                );
            } else {
                // Si el navegador no soporta la geolocalización
                handleLocationError(false, map.getCenter()); // Llama a la función para manejar el error
            }
        });
    }

    // Añade un listener para los clics en el mapa para medir distancias
    map.addListener('click', (mapsMouseEvent) => {
        // Agrega un event listener al mapa para detectar clics
        if (userLocation) {
            // Si la ubicación del usuario está disponible
            addLatLng(mapsMouseEvent.latLng); // Llama a la función para agregar la coordenada al array de ruta
        } else {
            alert("La ubicación del usuario aún no está disponible."); // Muestra una alerta si la ubicación no está disponible
        }
    });

    // Agrega un listener para el evento de cambio de zoom
    map.addListener('zoom_changed', () => {
        if (userCircle) {
            userCircle.setRadius(calculateCircleRadius());
        }
    });
}

// Función para agregar una coordenada a la ruta de medición
function addLatLng(clickLatLng) {
    if (!userLocation) {
        console.error("User location not available.");
        return;
    }

    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);

    // Si ya existe una polyline, la elimina del mapa
    if (polyline) {
        polyline.setMap(null);
    }

    // Crea una nueva polyline para la medición
    polyline = new google.maps.Polyline({
        path: [userLatLng, clickLatLng], // Asigna el array de coordenadas a la polyline
        geodesic: true, // Indica que la ruta debe seguir la curvatura de la Tierra
        strokeColor: '#FF0000', // Color de la línea (rojo)
        strokeOpacity: 1.0, // Opacidad de la línea
        strokeWeight: 2, // Grosor de la línea
        map: map, // Asigna el mapa a la polyline
    });

    // Agrega un listener para eliminar la polyline al hacer clic sobre ella
    polyline.addListener('click', () => {
        polyline.setMap(null); // Elimina la polyline del mapa
        distanceDiv.textContent = `Distancia: ${0} yd`; // Muestra la distancia en el elemento HTML
    });

    // Calcula la distancia entre la ubicación del usuario y el punto de clic
    calculateDistance(userLatLng, clickLatLng);
}

// Función para calcular la distancia total de la ruta
function calculateDistance(startLatLng, endLatLng) {
    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(startLatLng, endLatLng); // Calcula la distancia entre dos coordenadas
    // Convertir metros a yardas (1 metro ≈ 1.09361 yardas)
    const distanceYards = (distanceMeters * 1.09361).toFixed(2); // Convierte la distancia de metros a yardas y la formatea a 2 decimales
    distanceDiv.textContent = `Distancia: ${distanceYards} yd`; // Muestra la distancia en el elemento HTML
}

function calculateCircleRadius() {
    const zoomLevel = map.getZoom();
    // Ajustamos estos valores según sea necesario para que el círculo se vea bien en diferentes niveles de zoom
    return 5 / Math.pow(2, zoomLevel - 19);
}

// Función para manejar los errores de geolocalización
function handleLocationError(browserHasGeolocation, pos, error = null) {
    let errorMessage = browserHasGeolocation
        ? "Error: El servicio de geolocalización falló." // Mensaje de error si el servicio de geolocalización falló
        : "Error: Tu navegador no soporta geolocalización."; // Mensaje de error si el navegador no soporta la geolocalización
    if (error) {
        errorMessage += ` Código: ${error.code}, Mensaje: ${error.message}`; // Agrega detalles del error si los hay
    }
    const infoWindow = new google.maps.InfoWindow({
        content: errorMessage, // Establece el mensaje de error como contenido de la ventana de información
    });
    infoWindow.setPosition(pos); // Establece la posición de la ventana de información
    infoWindow.open(map); // Abre la ventana de información en el mapa
}

// Importante: Detener el seguimiento de la ubicación cuando la página se va a cerrar o navegar fuera (alternativa a unload)
window.addEventListener('beforeunload', function () {
    // Agrega un event listener para el evento beforeunload (cuando la página se va a cerrar o recargar)
    if (navigator.geolocation && watchId) {
        // Si la geolocalización está disponible y hay un ID de seguimiento
        navigator.geolocation.clearWatch(watchId); // Detiene el seguimiento de la ubicación para liberar recursos
    }
});