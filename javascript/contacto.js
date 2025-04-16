const negocio = { lat: 38.3645887, lng: -0.4702041 }; // Tu negocio
const masterD = { lat: 38.3411068, lng: -0.4933553 }; // Dirección MasterD

function initMap() {
  const mapContainer = document.querySelector(".map");

  if (!mapContainer) {
    console.error("No se encontró el contenedor del mapa con la clase 'map'");
    return;
  }

  const map = new google.maps.Map(mapContainer, {
    zoom: 14,
    center: negocio,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  // Marcador en el negocio
  new google.maps.Marker({
    position: negocio,
    map: map,
    title: "Mi Negocio",
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const cliente = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        trazarRuta(cliente, negocio, directionsService, directionsRenderer);
        map.setCenter(cliente);
      },
      function () {
        // Usuario deniega permisos, usar MasterD como origen
        trazarRuta(masterD, negocio, directionsService, directionsRenderer);
        map.setCenter(masterD);
      }
    );
  } else {
    // Navegador no soporta geolocalización
    trazarRuta(masterD, negocio, directionsService, directionsRenderer);
    map.setCenter(masterD);
  }
}

function trazarRuta(origen, destino, service, renderer) {
  const request = {
    origin: origen,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING
  };

  service.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      renderer.setDirections(result);
    } else {
      console.error("Error al calcular la ruta:", status);
      alert("No se pudo calcular la ruta: " + status);
    }
  });
}

window.onload = initMap;