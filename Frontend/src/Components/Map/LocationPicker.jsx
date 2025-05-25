import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle,  useMapEvents } from 'react-leaflet'
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
  const [ theatres , setTheatres] = useState([])


  const fetchTheatres = async(lat , lng) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"cinema|theatre"](around:5000, ${lat}, ${lng});
        way["amenity"~"cinema|theatre"](around:5000, ${lat}, ${lng});
        relation["amenity"~"cinema|theatre"](around:5000, ${lat}, ${lng});
      );
      out center;
      `;

    console.log('inside the fetchTheatres function')
    console.log('lat', lat , 'lng', lng)
    console.log("Overpass URL:", `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    try {
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await res.json();
        console.log('Fetched theatres data:', data);
        const theatre_data = data.elements.filter(element => element.tags && element.tags.name);
        console.log('Filtered theatres data:', theatre_data);
        const results = data.elements.map(element => ({
          lat : element.center.lat,
          lng : element.center.lon,
          name : element.tags.name || 'Theatre',
        }));
        console.log('Theatres:', results);  
        setTheatres(results);

    }catch(error) {
      console.error('Error fetching theatres:', error);
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log(pos)
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setCurrentLocation(coords);
        fetchTheatres(coords[0], coords[1])

      },
      (err) => {

        console.error('geo location error', err)
        const fallback = [11.1068448, 76.1099551]
        setCurrentLocation(fallback)
        fetchTheatres(fallback[0], fallback[1])
      }
    );
  }, [selectedLocation , onLocationSelect]);
  useEffect(() => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation)
    }
  }, [selectedLocation , onLocationSelect])
  console.log(theatres)
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

          <Circle center={selectedLocation} radius={1000} color="blue" fillOpacity={0.1} />
        )}

        {/* theatres */}

        {theatres.map((theatre, index) => (
          <Marker key={index} position={[theatre.lat, theatre.lng]} icon={customIcon}>
            <Popup>
              {theatre.name}
            </Popup>
          </Marker>
        ))}

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