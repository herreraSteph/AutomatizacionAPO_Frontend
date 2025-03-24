import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon // Cambiado de ScheduleIcon a WarningIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 500,
  ...(status === 'completed' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.error.light, // Cambiado de warning a error (rojo)
    color: theme.palette.error.dark,
  }),
}));

const EditTable = () => {
  // Datos de ejemplo
  const items = [
    { id: 1, name: 'Creación de CPC', status: 'completed', route: '/editar/cpc' },
    { id: 2, name: 'Cronograma', status: 'pending', route: '/editar/cronograma' },
    { id: 3, name: 'Asignación de Mano de Obra', status: 'pending', route: '/editar/mano-obra' },
    { id: 4, name: 'EQUIPO', status: 'completed', route: '/editar/equipo' },
    { id: 5, name: 'Descripcion Material', status: 'pending', route: '/editar/material' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <WarningIcon fontSize="small" />; // Cambiado a WarningIcon (rojo)
      default:
        return <WarningIcon fontSize="small" />;
    }
  };

  return (
    <TableContainer 
      component={Paper} 
      elevation={3}
      sx={{
        maxWidth: 1000,
        margin: '2rem auto',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      {/* Barra de títulos con fondo azul y texto blanco */}
      <Box sx={{ 
        p: 2,
        backgroundColor: 'primary.main',
        color: (theme) => theme.palette.common.white,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600,
          width: '33%',
          textAlign: 'left',
          pl: 3,
          color: 'inherit'
        }}>
          Elemento
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600,
          width: '33%',
          textAlign: 'center',
          color: 'inherit'
        }}>
          Estado
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600,
          width: '33%',
          textAlign: 'right',
          pr: 3,
          color: 'inherit'
        }}>
          Acciones
        </Typography>
      </Box>
      
      {/* Tabla sin encabezado visible */}
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ display: 'none' }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              hover
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: 500, width: '33%' }}>
                {item.name}
              </TableCell>
              <TableCell sx={{ width: '33%', textAlign: 'center' }}> {/* Centrado agregado aquí */}
                <Box display="flex" justifyContent="center"> {/* Contenedor flex para centrar */}
                  <StatusChip
                    icon={getStatusIcon(item.status)}
                    label={item.status === 'completed' ? 'Completado' : 'Pendiente'}
                    status={item.status}
                  />
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ width: '33%', pr: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  component={Link}
                  to={item.route}
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditTable;