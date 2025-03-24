import dashboard from './dashboard';
import pages from './pages';
import other from './other';
import proyectos from './proyectos';
import ProcesosUnitarios from './ProcesosUnitarios';

// ==============================|| MENU ITEMS ||============================== //
const rol = localStorage.getItem('rol');

let items;
// 1 significa construccion y 2 precios unitarios
if (rol === '1') {
  items = [dashboard, proyectos];
} else if (rol === '2') {
  items = [dashboard, ProcesosUnitarios];
} else {
  items = []; // O un valor por defecto en caso de que el rol no sea 1 ni 2
}

const menuItems = {
  items: items
};

export default menuItems;
