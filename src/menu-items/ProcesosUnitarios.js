import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import GradingIcon from '@mui/icons-material/Grading';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const icons = {
  AddIcon,
  AccessTimeIcon,
  PlagiarismIcon,
  GradingIcon,
  AssessmentIcon,
  DriveFolderUploadIcon,
  ListAltIcon,
};

const ProcesosUnitarios = {
  id: 'ProcesosUnitarios',
  title: 'Procesos Unitarios',
  type: 'group',
  children: [
    {
      id: 'Procesos-Unitarios',
      title: 'Proceso Unitarios',
      type: 'item',
      url: '/proyectos/PreciosUnitarios',
      icon: icons.ListAltIcon, // Corregido aquí
      breadcrumbs: false
    },
  ]
};

export default ProcesosUnitarios;