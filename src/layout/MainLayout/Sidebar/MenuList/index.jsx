import { Typography } from '@mui/material';
import useMenuItems from '../../../../menu-items/useMenuItems'; // Ajusta la ruta según tu estructura
import NavGroup from './NavGroup';

const MenuList = () => {
  const { items } = useMenuItems(); // Ahora es reactivo

  const navItems = items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;