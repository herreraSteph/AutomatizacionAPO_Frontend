import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  TablePagination,
  Typography,
  TextField,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { agregarMaterial, ObtenerMaterialesPorId } from "../../api/Construccion";
import { useNavigate, useLocation } from "react-router-dom";

const ListaMaterial = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const navigate = useNavigate();
  const location = useLocation();
  const materialIds = location.state?.materialIds || [];
  const id_proyecto = location.state?.id_proyecto;

  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        if (materialIds.length > 0) {
          const datos = await ObtenerMaterialesPorId(materialIds);
          setMateriales(datos.map(m => ({
            ...m,
            cantidad: 0
          })));
        }
      } catch (error) {
        console.error("Error al cargar materiales:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los materiales",
          severity: "error"
        });
      } finally {
        setApiLoading(false);
      }
    };

    cargarMateriales();
  }, [materialIds]);

  const handleCambioCantidad = (index, value) => {
    const nuevosMateriales = [...materiales];
    nuevosMateriales[index].cantidad = Number(value);
    setMateriales(nuevosMateriales);
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const materialesParaGuardar = materiales
        .filter(m => m.cantidad > 0)
        .map(material => ({
          id_material: material.id,
          cantidad: material.cantidad
        }));
      
      if (materialesParaGuardar.length === 0) {
        setSnackbar({
          open: true,
          message: "Debe ingresar cantidades mayores a 0 para al menos un material",
          severity: "warning"
        });
        return;
      }

      const respuesta = await agregarMaterial(id_proyecto, materialesParaGuardar);
      
      if (respuesta.tipoError === 0) {
        setSnackbar({
          open: true,
          message: "Materiales guardados correctamente",
          severity: "success"
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setSnackbar({
          open: true,
          message: respuesta.mensaje || "Error al guardar los materiales",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error al guardar materiales:", error);
      setSnackbar({
        open: true,
        message: "Ocurrió un error al guardar los materiales",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Card sx={{ 
        width: '100%', 
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <CardHeader
          title={
            <Typography variant="h2" component="div" sx={{ 
              color: "#060336", 
              fontWeight: "bold",
              padding: '16px 0 0 16px'
            }}>
              Listado de Materiales
            </Typography>
          }
          sx={{ 
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0'
          }}
        />
        
        <CardContent>
          <TableContainer component={Paper} sx={{ 
            mb: 3,
            boxShadow: 'none',
            border: '1px solid #e0e0e0'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#060336' }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold", width: '15%' }}>Código</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", width: '20%' }}>Desc. Corta</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", width: '30%' }}>Desc. Larga</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", width: '10%' }}>Unidad</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", width: '15%' }}>Cantidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : materiales.length > 0 ? (
                  materiales
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((material, index) => (
                      <TableRow key={material.id} hover>
                        <TableCell>{material.codigo}</TableCell>
                        <TableCell>{material.descripcion_corta}</TableCell>
                        <TableCell>{material.descripcion_larga}</TableCell>
                        <TableCell>{material.unidad}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={material.cantidad}
                            onChange={(e) => handleCambioCantidad(
                              page * rowsPerPage + index, 
                              e.target.value
                            )}
                            size="small"
                            fullWidth
                            inputProps={{ 
                              min: 0,
                              style: { textAlign: "center" } 
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No se encontraron materiales
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {materiales.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={materiales.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            )}
          </TableContainer>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 2
          }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: '20px',
                minWidth: '120px',
              }}
            >
              Volver
            </Button>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={loading || materiales.length === 0}
              sx={{
                backgroundColor: "#060336",
                color: "white",
                borderRadius: '20px',
                minWidth: '120px',
                "&:hover": {
                  backgroundColor: "#040225"
                },
                "&:disabled": {
                  backgroundColor: "#e0e0e0"
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ListaMaterial;