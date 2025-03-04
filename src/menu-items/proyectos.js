import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import GradingIcon from '@mui/icons-material/Grading';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import AddchartIcon from '@mui/icons-material/Addchart';
import SaveAltIcon from '@mui/icons-material/SaveAlt'; // Corregido aquí

const icons = {
  AddIcon,
  AccessTimeIcon,
  PlagiarismIcon,
  GradingIcon,
  AssessmentIcon,
  DriveFolderUploadIcon,
  AddchartIcon,
  SaveAltIcon // Ahora está correctamente importado
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
      id: 'TablaCompleta',
      title: 'CPC',
      type: 'item',
      url: '/proyectos/TablaCompleta',
      icon: icons.AddchartIcon,
      breadcrumbs: false
    },
    {
      id: 'DescargaCPC',
      title: 'DescargaCPC',
      type: 'item',
      url: '/proyectos/DescargaCPC',
      icon: icons.SaveAltIcon, // Ahora funciona correctamente
      breadcrumbs: false
    }
  ]
};

export default proyectos;