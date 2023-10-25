import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/Map/Map';

interface ILocation {
  lat: number;
  lng: number;
}

function App() {
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
  return <Map location={location} />;
}

export default App;
