import MapTemplate from '../../components/templates/Map/MapTemplate';
import { useEffect, useState } from 'react';

interface ILocation {
  lat: number;
  lng: number;
}

const Map = () => {
  const [location, setLocation] = useState<ILocation>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);
  return <MapTemplate location={location} />;
};

export default Map;
