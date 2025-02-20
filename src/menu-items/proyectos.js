
import  AddIcon  from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import GradingIcon from '@mui/icons-material/Grading';
const icons = {
  AddIcon,
  AccessTimeIcon,
  PlagiarismIcon,
  GradingIcon
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
      id: 'CPC',
      title: 'Control de Pedido del Cliente',
      type: 'item',
      url: '/proyectos/CPC',
      icon: icons.GradingIcon,
      breadcrumbs: false
    }
  ]
};

export default proyectos;