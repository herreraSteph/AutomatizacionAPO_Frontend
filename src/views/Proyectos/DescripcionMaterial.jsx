import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  AlertTitle,
  TextField,
  IconButton,
  Typography,
  Box,
  TablePagination,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ObtenerFamilias, 
  ObtenerSubfamiliasPorFamilia, 
  ObtenerCategoriasPorSubfamilia, 
  ObtenerMaterialesPaginados,
  ObtenerNumeroMateriales
} from "../../api/Construccion";

const DescripcionMaterial = () => {
  // Estados para los selectores y búsqueda
  const [familias, setFamilias] = useState([]);
  const [subfamilias, setSubfamilias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [selectedSubfamilia, setSelectedSubfamilia] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para los materiales
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Estados para UI
  const [isOnline, setIsOnline] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalMateriales, setTotalMateriales] = useState(0);
  const [loadingFamilias, setLoadingFamilias] = useState(true);
  const [loadingSubfamilias, setLoadingSubfamilias] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const location = useLocation();
  const id_proyecto = location.state?.id_proyecto;

  const navigate = useNavigate();

  // Efecto para verificar conexión
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Obtener familias al cargar el componente
  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        setLoadingFamilias(true);
        const response = await ObtenerFamilias();
        setFamilias(response);
        setLoadingFamilias(false);
      } catch (error) {
        console.error("Error al obtener familias:", error);
        setLoadingFamilias(false);
      }
    };

    fetchFamilias();
  }, []);

  // Obtener subfamilias cuando se selecciona una familia
  useEffect(() => {
    const fetchSubfamilias = async () => {
      if (selectedFamilia) {
        try {
          setLoadingSubfamilias(true);
          const response = await ObtenerSubfamiliasPorFamilia(selectedFamilia);
          setSubfamilias(response);
          setSelectedSubfamilia("");
          setSelectedCategoria("");
          setLoadingSubfamilias(false);
        } catch (error) {
          console.error("Error al obtener subfamilias:", error);
          setLoadingSubfamilias(false);
        }
      }
    };

    fetchSubfamilias();
  }, [selectedFamilia]);

  // Obtener categorias cuando se selecciona una subfamilia
  useEffect(() => {
    const fetchCategorias = async () => {
      if (selectedSubfamilia) {
        try {
          setLoadingCategorias(true);
          const response = await ObtenerCategoriasPorSubfamilia(selectedSubfamilia);
          setCategorias(response);
          setSelectedCategoria("");
          setLoadingCategorias(false);
        } catch (error) {
          console.error("Error al obtener categorías:", error);
          setLoadingCategorias(false);
        }
      }
    };

    fetchCategorias();
  }, [selectedSubfamilia]);

  // Efecto principal para obtener materiales
  useEffect(() => {
    const fetchMateriales = async () => {
      if (selectedCategoria) {
        try {
          setSearchLoading(true);
          
          const params = {
            categoria_id: selectedCategoria,
            busqueda: searchTerm,
            numeroPagina: page + 1,
            numeroRegistros: rowsPerPage
          };
          
          const totalResponse = await ObtenerNumeroMateriales({
            categoria_id: selectedCategoria,
            busqueda: searchTerm
          });
          setTotalMateriales(totalResponse.total_filas || 0);
          
          const response = await ObtenerMaterialesPaginados(params);
          setSuggestions(response || []);
          setSearchLoading(false);
          setShowResults(true);
        } catch (error) {
          console.error("Error al obtener materiales:", error);
          setSearchLoading(false);
        }
      }
    };

    fetchMateriales();
  }, [selectedCategoria, page, rowsPerPage, searchTerm]);

  // Función para buscar materiales
  const handleSearch = async () => {
    if (selectedCategoria) {
      try {
        setSearchLoading(true);
        setSearchTerm(searchInput);
        setPage(0);
      } catch (error) {
        console.error("Error al buscar materiales:", error);
        setSearchLoading(false);
      }
    }
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(0);
  };

  // Función para renderizar skeletons durante la carga
  const renderSkeletons = () => {
    return Array(rowsPerPage).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
      </TableRow>
    ));
  };

  // Handlers para los selectores
  const handleFamiliaChange = (event) => {
    setSelectedFamilia(event.target.value);
    setSearchInput("");
    setSearchTerm("");
    setSuggestions([]);
    setShowResults(false);
    setPage(0);
  };

  const handleSubfamiliaChange = (event) => {
    setSelectedSubfamilia(event.target.value);
    setSearchInput("");
    setSearchTerm("");
    setSuggestions([]);
    setShowResults(false);
    setPage(0);
  };

  const handleCategoriaChange = (event) => {
    setSelectedCategoria(event.target.value);
    setSearchInput("");
    setSearchTerm("");
    setPage(0);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleAddMaterial = (material) => {
    if (!selectedMaterials.some(m => m.id === material.id)) {
      setSelectedMaterials(prev => [...prev, material]);
    } else {
      setSelectedMaterials(prev => prev.filter(m => m.id !== material.id));
    }
  };

  // Funciones para paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para verificar si un material está seleccionado
  const isMaterialSelected = (id) => {
    return selectedMaterials.some(m => m.id === id);
  };

  // Función para abrir el modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Función para redireccionar a listaMaterial con los IDs
  const handleNavigateToList = () => {
    const materialIds = selectedMaterials.map(material => material.id);
    navigate('/proyectos/listaMaterial', { 
      state: { materialIds, id_proyecto } 
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          No estás conectado a Internet
        </Alert>
      )}

      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        <Typography variant="h7" component="h1" sx={{ color: 'black', fontWeight: 'bold', marginBottom: 4 }}>
          Materiales
        </Typography>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px", 
          marginBottom: "30px"
        }}>
          <Select
            value={selectedFamilia}
            onChange={handleFamiliaChange}
            displayEmpty
            variant="outlined"
            sx={{ height: "50px" }}
            disabled={loadingFamilias}
          >
            <MenuItem value="" disabled>Familias</MenuItem>
            {loadingFamilias ? (
              <MenuItem disabled>Cargando...</MenuItem>
            ) : (
              familias.map((familia) => (
                <MenuItem key={familia.id} value={familia.id}>
                  {familia.nombre}
                </MenuItem>
              ))
            )}
          </Select>

          <Select
            value={selectedSubfamilia}
            onChange={handleSubfamiliaChange}
            displayEmpty
            variant="outlined"
            sx={{ height: "50px" }}
            disabled={!selectedFamilia || loadingSubfamilias}
          >
            <MenuItem value="" disabled>SubFamilias</MenuItem>
            {loadingSubfamilias ? (
              <MenuItem disabled>Cargando...</MenuItem>
            ) : (
              subfamilias.map((subfamilia) => (
                <MenuItem key={subfamilia.id} value={subfamilia.id}>
                  {subfamilia.nombre}
                </MenuItem>
              ))
            )}
          </Select>

          <Select
            value={selectedCategoria}
            onChange={handleCategoriaChange}
            displayEmpty
            variant="outlined"
            sx={{ height: "50px" }}
            disabled={!selectedSubfamilia || loadingCategorias}
          >
            <MenuItem value="" disabled>Categorias</MenuItem>
            {loadingCategorias ? (
              <MenuItem disabled>Cargando...</MenuItem>
            ) : (
              categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))
            )}
          </Select>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            gridColumn: '1 / -1',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <TextField
              fullWidth
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              label="Buscar material específico"
              variant="outlined"
              sx={{ height: "50px" }}
              InputProps={{
                endAdornment: searchInput && (
                  <IconButton
                    onClick={handleClearSearch}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            
            {searchLoading ? (
              <Skeleton variant="rectangular" width={100} height={50} sx={{ borderRadius: 1 }} />
            ) : (
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!selectedCategoria}
                sx={{
                  height: '50px',
                  minWidth: '100px',
                  backgroundColor: '#060336',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#002244'
                  },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '16px'
                }}
              >
                Buscar
              </Button>
            )}
          </Box>
        </div>

        {showResults && (
          <Paper sx={{ mb: 3 }}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>COD</TableCell>
                    <TableCell>DESCRIPCIÓN CORTA</TableCell>
                    <TableCell>DESCRIPCIÓN LARGA</TableCell>
                    <TableCell>UNIDAD</TableCell>
                    <TableCell>ACCIÓN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchLoading ? (
                    renderSkeletons()
                  ) : suggestions.length > 0 ? (
                    suggestions.map((material) => (
                      <TableRow key={material.id} hover>
                        <TableCell>{material.codigo}</TableCell>
                        <TableCell>{material.descripcion_corta}</TableCell>
                        <TableCell>{material.descripcion_larga}</TableCell>
                        <TableCell>{material.unidad}</TableCell>
                        <TableCell>
                          <IconButton 
                            color={isMaterialSelected(material.id) ? "success" : "primary"}
                            onClick={() => handleAddMaterial(material)}
                          >
                            {isMaterialSelected(material.id) ? <CheckIcon /> : <AddIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No se encontraron resultados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalMateriales}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
            />
          </Paper>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {selectedMaterials.length > 0 ? (
              <Button 
                onClick={handleOpenModal}
                sx={{ textTransform: 'none' }}
              >
                Materiales seleccionados: {selectedMaterials.length}
              </Button>
            ) : (
              <Skeleton variant="text" width={150} />
            )}
          </div>
          <Button
            variant="contained"
            onClick={handleNavigateToList}
            disabled={selectedMaterials.length === 0}
            sx={{
              backgroundColor: "#060336",
              color: "white",
              padding: "8px 20px",
              borderRadius: "20px",
            }}
          >
            Siguiente
          </Button>
        </div>

        {/* Modal para mostrar materiales seleccionados */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Materiales Seleccionados</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>COD</TableCell>
                    <TableCell>DESCRIPCIÓN CORTA</TableCell>
                    <TableCell>DESCRIPCIÓN LARGA</TableCell>
                    <TableCell>UNIDAD</TableCell>
                    <TableCell>ACCIÓN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedMaterials.length > 0 ? (
                    selectedMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.codigo}</TableCell>
                        <TableCell>{material.descripcion_corta}</TableCell>
                        <TableCell>{material.descripcion_larga}</TableCell>
                        <TableCell>{material.unidad}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="error"
                            onClick={() => handleAddMaterial(material)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No hay materiales seleccionados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default DescripcionMaterial;