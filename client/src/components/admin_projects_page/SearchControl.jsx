import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const SearchControl = ({ setPosition }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: "Search for places",
      showMarker: false,
      showPopup: false,
      animateZoom: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      setPosition([y, x]); // Leaflet uses lat, lng
      map.setView([y, x], 13);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setPosition]);

  return null;
};

export default SearchControl;
