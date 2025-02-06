// assets
import { IconDashboard } from '@tabler/icons-react';
import HomeIcon from '@mui/icons-material/Home';

// constant
const icons = { HomeIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Inicio',
      type: 'item',
      url: '/dashboard/default',
      icon: HomeIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
