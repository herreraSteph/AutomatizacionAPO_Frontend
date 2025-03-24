// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  title: 'Documentación',
  type: 'group',
  children: [
   
    {
      id: 'documentation',
      title: 'documentacion',
      type: 'item',
      url: '/dashboard/default',
    
      external: true,
      target: true
    },
  ]
};

export default other;
