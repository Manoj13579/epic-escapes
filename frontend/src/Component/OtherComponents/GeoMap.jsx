import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// used to control map behavior like customizing markers
import L from "leaflet";
import axios from "axios";
/* Import the marker icon images. these are in this folder by default when installing leaflet(js library to use OpenStreetMap). can move these images to other folders like public etc. using Nominatim API from OpenStreetMap(map provider like google)  shows places in local language. google map api shows english but needs card */
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import Loader from "../../Utils/Loader";
import { toast } from "react-toastify";

/* Delete and Merge Options: Leaflet has default marker icons, but this code is customizing those default marker icons to use the images we imported earlier (markerIconUrl, markerIconRetinaUrl, markerShadowUrl).
delete L.Icon.Default.prototype._getIconUrl: This deletes the default method for getting the icon URL (because we want to define our own).
L.Icon.Default.mergeOptions: This customizes the icon options by providing the URLs for the marker icon and its shadow */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetinaUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});
const GeoMap = ({ location }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false)

  
  

  const fetchCoordinates = async () => {
    setLoading(true);
    // using  Nominatim API to get coordinates or lat, lan by passing location.
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&accept-language=en`
      );
      if (response.data.length > 0) {
        setCoordinates([response.data[0].lat, response.data[0].lon]);
      } else {
        toast.error("Location not found");
        console.error("error");
      }
    } catch (error) {
      toast.error("Failed to fetch coordinates");
      console.error(error);
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchCoordinates()
  }, [location]);


  // use loader here won't work in jsx
  if (loading) {
    return <Loader />;
  }


  return (
    /* MapContainer: This component displays the map. It needs a center (latitude and longitude of the location) and a zoom level (how zoomed in the map is). The style makes the map 500px tall and 100% wide. */
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      {/* This defines how the map tiles (images of the map) are loaded. It uses OpenStreetMap as the source for map tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* This places a marker on the map at the coordinates we fetched. When you click the marker, a Popup will show the name of the location */}
      <Marker position={coordinates}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
    
  );
};

export default GeoMap;