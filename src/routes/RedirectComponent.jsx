import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const message = sessionStorage.getItem('message');
    if (message) {
      navigate('/dashboard/default');
    } else {
      navigate('/pages/login/login3');
    }
  }, [navigate]);

  return null; // No renderiza nada, solo redirige
};

export default RedirectComponent;