// assets
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
// constant
const icons = {
  PlagiarismIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const proyectos = {
  id: 'proyectos',
  title: 'Proyectos',
  type: 'group',
  children: [
    {
      id: 'descripcionmaterial',
      title: 'Descripción de Material',
      type: 'item',
      url: '/proyectos/descripcionmaterial',
      icon: icons.PlagiarismIcon,
      breadcrumbs: false
    }
  ]
};

export default proyectos;
