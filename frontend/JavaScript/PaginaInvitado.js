let mapa; // Variable para almacenar la instancia del mapa de Google Maps
let distanciaDiv; // Variable para el elemento HTML donde se mostrará la distancia total medida
let circuloUsuario; // Círculo para representar la ubicación del usuario en el mapa
let idRastreo;    // ID para rastrear la suscripción de watchPosition, necesario para detener el rastreo
let ubicacionUsuario = null; // Variable para almacenar la ubicación actual del usuario
let polylinea = null; // Polyline para dibujar la ruta de medición
let ubicacionInicialEstablecida = false; // Variable para controlar si la ubicación inicial ya se ha establecido
let modoDistancia = false; // Variable para controlar en qué modo de distancia está el usuario
let puntoA = null; // Variable para almacenar el primer punto seleccionado en el modo de distancia entre A y B

// Función principal para inicializar el mapa de Google Maps
function initMap() {
    // Obtiene el elemento HTML donde se insertará el mapa
    const mapaDiv = document.getElementById("mapa");

    // Crea una nueva instancia del mapa de Google Maps
    mapa = new google.maps.Map(mapaDiv, {
        zoom: 18, // Establece el nivel de zoom inicial del mapa (más cercano)
        center: { lat: 0, lng: 0 }, // Establece el centro inicial del mapa (latitud y longitud)
        mapTypeId: 'satellite', // Establece el tipo de mapa a vista de satélite
        disableDefaultUI: true, // Oculta la mayoría de los controles predeterminados del mapa
        panControl: true,     // Muestra el control de pan (movimiento) en el mapa
        streetViewControl: false, // Oculta el control de Street View
        mapTypeControl: false, // Oculta el control de tipo de mapa
        fullscreenControl: false // Oculta el control de pantalla completa
    });

    // Intenta obtener y observar la ubicación del usuario en tiempo real
    if (navigator.geolocation) {
        // Define las opciones para la geolocalización
        const opcionesUbicacion = {
            enableHighAccuracy: true, // Solicita la ubicación más precisa posible
            timeout: 10000,          // Tiempo máximo para la primera obtención de ubicación (10 segundos)
            maximumAge: 0             // No usar ubicaciones en caché
        };

        // Utiliza watchPosition para obtener la ubicación del usuario de forma continua
        idRastreo = navigator.geolocation.watchPosition(
            (position) => {
                // Callback que se ejecuta cuando se obtiene una nueva ubicación
                ubicacionUsuario = {
                    lat: position.coords.latitude, // Obtiene la latitud de la ubicación
                    lng: position.coords.longitude, // Obtiene la longitud de la ubicación
                };
                const ubicacionUsuarioLatLng = new google.maps.LatLng(ubicacionUsuario.lat, ubicacionUsuario.lng); // Crea un objeto LatLng con la ubicación del usuario

                // Centra el mapa en la ubicación del usuario solo la primera vez
                if (!ubicacionInicialEstablecida) {
                    mapa.setCenter(ubicacionUsuarioLatLng); // Centra el mapa en la ubicación del usuario
                    ubicacionInicialEstablecida = true; // Marca que la ubicación inicial ya se ha establecido
                }

                // Si el círculo del usuario no existe, créalo; si existe, actualiza su centro
                if (circuloUsuario) {
                    circuloUsuario.setCenter(ubicacionUsuarioLatLng); // Actualiza el centro del círculo existente
                    circuloUsuario.setRadius(calcularRadioCirculo()); // Actualiza el radio del círculo
                } else {
                    // Crea un nuevo círculo para representar la ubicación del usuario
                    circuloUsuario = new google.maps.Circle({
                        strokeColor: '#FFFF', // Color del borde del círculo (blanco)
                        strokeOpacity: 1, // Opacidad del borde del círculo
                        strokeWeight: 3, // Grosor del borde del círculo
                        fillColor: '#0000FF', // Color de relleno del círculo (azul claro)
                        fillOpacity: 1, // Opacidad del relleno del círculo
                        map: mapa, // Asigna el mapa al círculo
                        center: ubicacionUsuarioLatLng, // Establece el centro del círculo en la ubicación del usuario
                        radius: calcularRadioCirculo(), // Radio del círculo en metros (ajusta según sea necesario)
                    });
                }
            },
            (error) => {
                // Callback que se ejecuta si hay un error al obtener la ubicación
                manejarErrorUbicacion(true, mapa.getCenter(), error); // Llama a la función para manejar el error
            },
            opcionesUbicacion // Pasa las opciones de geolocalización
        );
    } else {
        // Si el navegador no soporta la geolocalización
        manejarErrorUbicacion(false, mapa.getCenter()); // Llama a la función para manejar el error
    }

    // Añade un listener para el botón de centrar
    const botonCentrar = document.getElementById('centrarMapa');

    botonCentrar.addEventListener('click', () => {
        // Agrega un event listener al botón para centrar el mapa en la ubicación del usuario
        if (navigator.geolocation) {
            // Si el navegador soporta la geolocalización
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Callback que se ejecuta cuando se obtiene la ubicación
                    ubicacionUsuario = {
                        lat: position.coords.latitude, // Obtiene la latitud de la ubicación
                        lng: position.coords.longitude, // Obtiene la longitud de la ubicación
                    };
                    const ubicacionUsuarioLatLng = new google.maps.LatLng(ubicacionUsuario.lat, ubicacionUsuario.lng); // Crea un objeto LatLng con la ubicación del usuario
                    mapa.setCenter(ubicacionUsuarioLatLng); // Centra el mapa en la ubicación del usuario
                    mapa.setZoom(18); // Establece el zoom al valor inicial
                    if (circuloUsuario) {
                        circuloUsuario.setCenter(ubicacionUsuarioLatLng); // Actualiza el centro del círculo existente
                    } else {
                        // Crea un nuevo círculo para representar la ubicación del usuario
                        circuloUsuario = new google.maps.Circle({
                            strokeColor: '#0000FF', // Color del borde del círculo (azul)
                            strokeOpacity: 0.8, // Opacidad del borde del círculo
                            strokeWeight: 2, // Grosor del borde del círculo
                            fillColor: '#ADD8E6', // Color de relleno del círculo (azul claro)
                            fillOpacity: 0.4, // Opacidad del relleno del círculo
                            map: mapa, // Asigna el mapa al círculo
                            center: ubicacionUsuarioLatLng, // Establece el centro del círculo en la ubicación del usuario
                            radius: 10, // Radio del círculo en metros (ajusta según sea necesario)
                        });
                    }
                },
                (error) => {
                    // Callback que se ejecuta si hay un error al obtener la ubicación
                    manejarErrorUbicacion(true, mapa.getCenter(), error); // Llama a la función para manejar el error
                },
                {
                    enableHighAccuracy: true, // Solicita la ubicación más precisa posible
                    timeout: 5000, // Tiempo máximo para la primera obtención de ubicación (5 segundos)
                    maximumAge: 0 // No usar ubicaciones en caché
                }
            );
        } else {
            // Si el navegador no soporta la geolocalización
            manejarErrorUbicacion(false, mapa.getCenter()); // Llama a la función para manejar el error
        }
    });

    // Añade un listener para el botón de cambiar el modo de distancia
    const cambiarDistancia = document.getElementById('cambiarDistancia');
    cambiarDistancia.addEventListener('click', () => {
        // Cambia el modo de distancia (alternar entre activado/desactivado)
        modoDistancia = !modoDistancia; // Invierte el valor de la variable modoDistancia
    });

    // Añade un listener para los clics en el mapa para medir distancias
    mapa.addListener('click', (mapsMouseEvent) => {
        if (modoDistancia) {
            // Modo de distancia entre dos puntos (A y B)
            if (!puntoA) {
                // Si no hay un punto A, establece el punto A
                puntoA = mapsMouseEvent.latLng; // Guarda la ubicación del clic como el punto A
            } else {
                // Si ya hay un punto A, selecciona el punto B y calcula la distancia
                const puntoB = mapsMouseEvent.latLng; // Guarda la ubicación del clic como el punto B

                // Si ya existe una polyline, la elimina del mapa
                if (polylinea) {
                    // Si la polyline existe
                    polylinea.setMap(null); // Elimina la polyline del mapa
                }

                // Crea una nueva polyline para la medición
                polylinea = new google.maps.Polyline({
                    path: [puntoA, puntoB], // Asigna el array de coordenadas a la polyline
                    geodesic: true, // Indica que la ruta debe seguir la curvatura de la Tierra
                    strokeColor: '#FFFF', // Color de la línea (blanco)
                    strokeOpacity: 1.0, // Opacidad de la línea
                    strokeWeight: 3, // Grosor de la línea
                    map: mapa, // Asigna el mapa a la polyline
                });

                // Agrega un listener para eliminar la polyline al hacer clic sobre ella
                polylinea.addListener('click', () => {
                    // Agrega un event listener a la polyline para detectar clics
                    polylinea.setMap(null); // Elimina la polyline del mapa
                    distanciaDiv.textContent = `Distancia: ${0} yd`; // Muestra la distancia en el elemento HTML
                });

                calcularDistancia(puntoA, puntoB); // Calcula la distancia entre los puntos A y B
                puntoA = null; // Reinicia el punto A para futuras mediciones
            }
        } else {
            // Modo de distancia desde la ubicación del usuario
            if (ubicacionUsuario) {
                agregarLatLng(mapsMouseEvent.latLng); // Agrega la coordenada seleccionada a la ruta de medición
            } else {
                alert("La ubicación del usuario aún no está disponible."); // Muestra un mensaje si la ubicación no está disponible
            }
        }
    });

    // Agrega un listener para el evento de cambio de zoom
    mapa.addListener('zoom_changed', () => {
        // Agrega un event listener al mapa para detectar cambios en el nivel de zoom
        if (circuloUsuario) {
            // Si el círculo del usuario existe
            circuloUsuario.setRadius(calcularRadioCirculo()); // Actualiza el radio del círculo según el nivel de zoom
        }
    });
}

// Función para agregar una coordenada a la ruta de medición
function agregarLatLng(clickLatLng) {
    // Función para agregar una coordenada a la ruta de medición
    if (!ubicacionUsuario) {
        // Si la ubicación del usuario no está disponible
        console.error("User location not available."); // Muestra un mensaje de error en la consola
        return; // Sale de la función
    }

    const ubicacionUsuarioLatLng = new google.maps.LatLng(ubicacionUsuario.lat, ubicacionUsuario.lng); // Crea un objeto LatLng con la ubicación del usuario

    // Si ya existe una polyline, la elimina del mapa
    if (polylinea) {
        // Si la polyline existe
        polylinea.setMap(null); // Elimina la polyline del mapa
    }

    // Crea una nueva polyline para la medición
    polylinea = new google.maps.Polyline({
        path: [ubicacionUsuarioLatLng, clickLatLng], // Asigna el array de coordenadas a la polyline
        geodesic: true, // Indica que la ruta debe seguir la curvatura de la Tierra
        strokeColor: '#FFFF', // Color de la línea (rojo)
        strokeOpacity: 1.0, // Opacidad de la línea
        strokeWeight: 3, // Grosor de la línea
        map: mapa, // Asigna el mapa a la polyline
    });

    // Agrega un listener para eliminar la polyline al hacer clic sobre ella
    polylinea.addListener('click', () => {
        // Agrega un event listener a la polyline para detectar clics
        polylinea.setMap(null); // Elimina la polyline del mapa
        distanciaDiv.textContent = `Distancia: ${0} yd`; // Muestra la distancia en el elemento HTML
    });

    // Calcula la distancia entre la ubicación del usuario y el punto de clic
    calcularDistancia(ubicacionUsuarioLatLng, clickLatLng); // Llama a la función para calcular la distancia
}

// Inicializa el elemento para mostrar la distancia si existe
distanciaDiv = document.getElementById('distancia');

// Función para calcular la distancia total de la ruta
function calcularDistancia(inicioLatLng, finLatLng) {
    // Función para calcular la distancia total de la ruta
    const distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(inicioLatLng, finLatLng); // Calcula la distancia entre dos coordenadas
    // Convertir metros a yardas (1 metro ≈ 1.09361 yardas)
    const distanciaYardas = (distanciaMetros * 1.09361).toFixed(2); // Convierte la distancia de metros a yardas y la formatea a 2 decimales
    distanciaDiv.textContent = `Distancia: ${distanciaYardas} yd`; // Muestra la distancia en el elemento HTML
}

function calcularRadioCirculo() {
    // Función para calcular el radio del círculo según el nivel de zoom
    const nivelZoom = mapa.getZoom(); // Obtiene el nivel de zoom actual del mapa
    // Ajustamos estos valores según sea necesario para que el círculo se vea bien en diferentes niveles de zoom
    return 7 / Math.pow(2, nivelZoom - 19); // Calcula el radio del círculo
}

// Función para manejar los errores de geolocalización
function manejarErrorUbicacion(navegadorTieneGeolocalizacion, pos, error = null) {
    // Función para manejar los errores de geolocalización
    let mensajeError = navegadorTieneGeolocalizacion
        ? "Error: El servicio de geolocalización falló." // Mensaje de error si el servicio de geolocalización falló
        : "Error: Tu navegador no soporta geolocalización."; // Mensaje de error si el navegador no soporta la geolocalización
    if (error) {
        // Si hay un error
        mensajeError += ` Código: ${error.code}, Mensaje: ${error.message}`; // Agrega detalles del error si los hay
    }
    const ventanaInformacion = new google.maps.InfoWindow({
        // Crea una nueva ventana de información
        content: mensajeError, // Establece el mensaje de error como contenido de la ventana de información
    });
    ventanaInformacion.setPosition(pos); // Establece la posición de la ventana de información
    ventanaInformacion.open(mapa); // Abre la ventana de información en el mapa
}

// Importante: Detener el seguimiento de la ubicación cuando la página se va a cerrar o navegar fuera (alternativa a unload)
window.addEventListener('beforeunload', function () {
    // Agrega un event listener para el evento beforeunload (cuando la página se va a cerrar o recargar)
    if (navigator.geolocation && idRastreo) {
        // Si la geolocalización está disponible y hay un ID de seguimiento
        navigator.geolocation.clearWatch(idRastreo); // Detiene el seguimiento de la ubicación para liberar recursos
    }
});