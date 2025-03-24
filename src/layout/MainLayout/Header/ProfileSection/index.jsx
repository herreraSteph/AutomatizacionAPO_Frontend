import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'; // Nuevo ícono

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';

// assets
import { IconSettings } from '@tabler/icons-react'; // Solo necesitamos IconSettings

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  
  const anchorRef = useRef(null);

  const handleLogout = async () => {
    console.log('Logout');
    // Aquí puedes agregar la lógica de cierre de sesión, por ejemplo, limpiar el estado global o las cookies
    navigate('/pages/login/login3');
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '45px',
          width: '45px', // Asegurar que el Chip sea un círculo perfecto
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Centrar el contenido horizontal y verticalmente
          borderRadius: '50%', // Hacer que el Chip sea completamente redondo
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          padding: 0, // Eliminar el padding interno
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-icon': {
            margin: 0, // Eliminar el margen del ícono
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
        icon={
          <ExitToAppRoundedIcon
            style={{
              cursor: 'pointer',
              fontSize: '24px', // Ajustar el tamaño del ícono
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(11px, -2px)', // Mover 2px a la derecha y 2px hacia arriba
            }}
            onClick={handleLogout}
          />
        }
        label={null} // No necesitamos un label adicional
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleLogout} // Ejecutar handleLogout al hacer clic en el Chip
        color="primary"
      />
    </>
  );
};

export default ProfileSection;