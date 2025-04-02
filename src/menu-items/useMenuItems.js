// hooks/useMenuItems.js
import { useEffect, useState } from 'react';
import dashboard from './dashboard';
import proyectos from './proyectos';
import ProcesosUnitarios from './ProcesosUnitarios';

const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState({ items: [] });

  useEffect(() => {
    const rol = sessionStorage.getItem('rol');
    let items;
    
    if (rol === '1') {
      items = [dashboard, proyectos];
    } else if (rol === '2') {
      items = [dashboard, ProcesosUnitarios];
    } else {
      items = [];
    }

    setMenuItems({ items });
  }, []); // Se ejecuta solo una vez al montar el componente

  return menuItems;
};

export default useMenuItems;