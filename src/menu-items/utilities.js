// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'Precios Unitarios',
  title: 'Precios Unitarios',
  type: 'group',
  children: [
    {
      id: 'Precios Unitarios',
      title: 'Precios Unitarios',
      type: 'item',
      url: '/utilities/PreciosUnitarios',
      icon: icons.DriveFolderUploadIcon,
      breadcrumbs: false
    }
  
  ]
};

export default utilities;
