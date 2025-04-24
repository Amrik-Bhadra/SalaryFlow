import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import SearchControl from "./SearchControl";

// Fix default icon issue
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

Modal.setAppElement("#root");

const LocationPickerModal = ({ isOpen, onClose, position, setPosition }) => {
  const [map, setMap] = useState(null);

  // Set to user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setPosition([51.505, -0.09]); // fallback to London
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setPosition([51.505, -0.09]);
    }
  }, []);

  // Add search box
  useEffect(() => {
    if (!map) return;

    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      style: "bar",
      searchLabel: "Enter address",
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  // Click on map to move marker
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return position ? <Marker position={position} /> : null;
  };

  const handleSubmit = () => {
    if (position) {
        setPosition([position[0], position[1]]);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Pick Location"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1000,
        },
        content: {
          width: "60vw", 
          maxWidth: "90vw",
          margin: "auto",
          height: "fit-content",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <h2 className="text-xl mb-2">Pick a Location</h2>
      <div style={{ height: "400px" }}>
        {position && (
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            whenCreated={setMap}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <SearchControl setPosition={setPosition} />
            <LocationMarker />
          </MapContainer>
        )}
      </div>
      {position ? (
        <>
          <p className="mt-2">Latitude: {position[0]}</p>
          <p>Longitude: {position[1]}</p>
        </>
      ) : (
        <p>Loading location...</p>
      )}
      <button className="mt-3 py-2 px-3 bg-primary-btn text-white rounded-md" onClick={handleSubmit} disabled={!position}>Submit</button>
    </Modal>
  );
};

export default LocationPickerModal;
