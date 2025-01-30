import  AddIcon  from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const icons = {
  AddIcon,
  AccessTimeIcon
};

const proyectos = {
  id: 'proyectos',
  title: 'Proyectos',
  type: 'group',
  children: [
    {
      id: 'crear-numero',
      title: 'Crear Numero',
      type: 'item',
      url: '/proyectos/crear-numero',
      icon: icons.AddIcon,
      breadcrumbs: false
    },
    {
      id: 'cronograma',
      title: 'Cronograma',
      type: 'item',
      url: '/proyectos/cronograma',
      icon: icons.AccessTimeIcon,
      breadcrumbs: false
    }
  ]
};

export default proyectos;