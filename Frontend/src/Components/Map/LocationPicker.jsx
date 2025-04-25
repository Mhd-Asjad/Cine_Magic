import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
}); 

function LocationMarker({ setSelectedLocation }) {
  useMapEvents({
    click(e) {
      setSelectedLocation([e.latlng.lat, e.latlng.lng])
    }
  });
  return null
}

function LocationPicker({ onLocationSelect }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setCurrentLocation(coords);
      },
      (err) => {
        console.error('geo location error', err)
        setCurrentLocation([11.1068448, 76.1099551])
      }
    );
  }, [])
  useEffect(() => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation)
    }
  }, [selectedLocation , onLocationSelect])
  console.log(selectedLocation )
  return (
    <>
      {currentLocation && (
        <MapContainer center={currentLocation} zoom={13} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            attribution='&copy; openStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentLocation} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
          {selectedLocation && (
            <Marker position={selectedLocation}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}
          <LocationMarker setSelectedLocation={setSelectedLocation} />
        </MapContainer>
      )}
    </>
  )
}

export default LocationPicker