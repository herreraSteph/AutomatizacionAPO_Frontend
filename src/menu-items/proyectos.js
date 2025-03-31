import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import GradingIcon from '@mui/icons-material/Grading';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import AddchartIcon from '@mui/icons-material/Addchart';
import SaveAltIcon from '@mui/icons-material/SaveAlt'; 
import EditIcon from '@mui/icons-material/Edit';

const icons = {
  AddIcon,
  AccessTimeIcon,
  PlagiarismIcon,
  GradingIcon,
  AssessmentIcon,
  DriveFolderUploadIcon,
  AddchartIcon,
  SaveAltIcon,
  EditIcon
};

const proyectos = {
  id: 'proyectos',
  title: 'Construcción',
  type: 'group',
  children: [
    {
      id: 'crear-numero',
      title: 'Crear Numero',
      type: 'item',
      url: 'proyectos/crear-numero',
      icon: icons.AddIcon,
      breadcrumbs: false
    },
    {
      id: 'TablaCompleta',  
      title: 'Proyectos pendientes',
      type: 'item',
      url: 'proyectos/Pendientes',
      icon: icons.AddchartIcon,
      breadcrumbs: false
    },
  
    {
      id: 'DescargaCPC',
      title: 'Proyectos Terminados',
      type: 'item',
      url: 'proyectos/Descargar',
      icon: icons.SaveAltIcon, // Ahora funciona correctamente
      breadcrumbs: false
    }
  ]
};

export default proyectos;