import React, { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from 'react-router-dom';

const KaKao = () => {
  const location = useLocation();
  const nav = useNavigate();
  console.info(location);

  useEffect(() => {
    nav('/');
  }, []);

  return <div>asdasd</div>;
};

export default KaKao;
