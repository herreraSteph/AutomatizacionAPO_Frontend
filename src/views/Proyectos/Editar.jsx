import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { CheckProjectData } from '../../api/Construccion';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 500,
  ...(status === 'completed' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

const EditTable = () => {
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { idNumero, nombreActividad, id_proyecto } = location.state || {};

  useEffect(() => {
    console.log("Datos recibidos:", location.state);
    
    const fetchProjectStatus = async () => {
      try {
        if (!id_proyecto) {
          console.warn("No hay ID de proyecto - no se puede hacer la solicitud");
          setLoading(false);
          return;
        }
        
        const response = await CheckProjectData(id_proyecto);
        console.log("Respuesta recibida:", response);
        
        // Forzar CPC como completado (true) pero mantener el valor real
        setProjectStatus({
          ...response,
          cpc: true // Visualmente siempre completado, pero guardamos el valor real
        });
      } catch (error) {
        console.error("Error al obtener estado del proyecto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectStatus();
  }, [id_proyecto, location.state]);

  // Función de navegación mejorada
  const handleNavigate = (route, item) => {
    const state = {
      id_proyecto,
      // Para CPC enviamos datos adicionales y el estado real (si existe)
      ...(route === '/proyectos/cpc' ? { 
        id: idNumero,
        nombreActividad, 
        Status: projectStatus?.cpc ?? true // Envía true si no hay datos
      } : { 
        // Para otras rutas enviamos el estado del item
        Status: projectStatus?.[item.apiKey] ?? false 
      })
    };
    
    navigate(route, { state });
  };

  // Definición de los items
  const items = [
    { 
      id: 1, 
      name: 'Creación de CPC', 
      apiKey: 'cpc',
      route: '/proyectos/cpc',
      alwaysCompleted: true
    },
    { 
      id: 2, 
      name: 'Cronograma', 
      apiKey: 'actividades', 
      route: '/proyectos/cronograma' 
    },
    { 
      id: 3, 
      name: 'Asignación de Mano de Obra', 
      apiKey: 'mano_obra', 
      route: '/proyectos/AsignacionManoObra' 
    },
    { 
      id: 4, 
      name: 'EQUIPO', 
      apiKey: 'equipo', 
      route: '/proyectos/equipo' 
    },
    { 
      id: 5, 
      name: 'Descripcion Material', 
      apiKey: 'materiales', 
      route: '/proyectos/DescripcionMaterial' 
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <WarningIcon fontSize="small" />;
      default:
        return <WarningIcon fontSize="small" />;
    }
  };

  const getItemStatus = (item) => {
    if (item.alwaysCompleted) return 'completed';
    if (!projectStatus) return 'pending';
    return projectStatus[item.apiKey] ? 'completed' : 'pending';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!projectStatus && id_proyecto) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">No se pudo cargar el estado del proyecto</Typography>
      </Box>
    );
  }

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
      
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ display: 'none' }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const status = getItemStatus(item);
            
            return (
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
                <TableCell sx={{ width: '33%', textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center">
                    <StatusChip
                      icon={getStatusIcon(status)}
                      label={status === 'completed' ? 'Completado' : 'Pendiente'}
                      status={status}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ width: '33%', pr: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleNavigate(item.route, item)}
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
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditTable;