import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { get, ref } from "firebase/database";
import { database } from "../../Auth/Firebase";

export function MapComponent() {
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    const userRef = ref(database, "ubicaciones_usuarios");
    get(userRef)
      .then((snapshot) => {
        const usersArray = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          usersArray.push({
            id: childSnapshot.key,
            lat: childData.latitud,
            lng: childData.longitud,
            nombre: childData.nombre // Agregar el nombre del usuario
          });
        });

        const coordinates = usersArray.map(({ lat, lng, nombre }) => ({ lat, lng, nombre }));

        if (!mapRef.current) {
          const map = L.map("map").setView(
            [coordinates[0].lat, coordinates[0].lng],
            3
          );
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
          mapRef.current = map;

          // Crear marcadores para cada conjunto de coordenadas
          markerRefs.current = coordinates.map((coord, index) => {
            console.log("Nombre:", coord.nombre); // Agregar este console.log para verificar los nombres
            const marker = L.marker([coord.lat, coord.lng]).addTo(map);
            marker.bindPopup(coord.nombre); // Mostrar el nombre del usuario en el popup
            marker.currentIndex = index; // Establecer el índice actual del marcador
            return marker;
          });
        }

        let currentIndex = 0; // Índice actual del marcador

        const intervalId = setInterval(() => {
          // Obtener el siguiente índice
          const nextIndex = (currentIndex + 1) % coordinates.length;

          // Obtener el marcador actual y el siguiente
          const currentMarker = markerRefs.current[currentIndex];
          const nextMarker = markerRefs.current[nextIndex];

          // Mover el mapa al siguiente marcador y establecer el índice actual
          mapRef.current.setView([nextMarker.getLatLng().lat, nextMarker.getLatLng().lng], 20);
          currentIndex = nextIndex;

          // Reiniciar el índice al llegar al final del arreglo
          if (nextIndex === 0) {
            currentIndex = 0;
          }
        }, 5000);

        return () => clearInterval(intervalId);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
}

export default MapComponent;
