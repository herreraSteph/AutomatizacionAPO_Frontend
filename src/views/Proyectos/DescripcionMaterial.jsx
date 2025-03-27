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
  Skeleton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import ListaMaterial from "./ListaMaterial";

const DescripcionMaterial = () => {
  // Estados para los selectores y búsqueda
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");
  
  // Estados para las sugerencias y materiales seleccionados
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Estados para UI
  const [isOnline, setIsOnline] = useState(true);
  const [showList, setShowList] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultsCount, setSearchResultsCount] = useState(0);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Datos de ejemplo
  const options1 = ["Acero", "Tubería", "Accesorios"];
  const options2 = {
    "Acero": ["Varillas", "Perfiles", "Alambrón"],
    "Tubería": ["PVC", "CPVC", "Hierro"],
    "Accesorios": ["Codos", "Tees", "Uniones"]
  };

  const options3 = {
    "Varillas": ["Varilla 1/4\"", "Varilla 1/2\"", "Varilla 3/4\""],
    "Perfiles": ["Perfil C 2x1", "Perfil L 2x2", "Perfil U 3x1.5"],
    "Alambrón": ["Alambrón #8", "Alambrón #10", "Alambrón #12"],
    "PVC": ["PVC 1/2\"", "PVC 3/4\"", "PVC 1\""],
    "CPVC": ["CPVC 1/2\"", "CPVC 3/4\"", "CPVC 1\""],
    "Hierro": ["Hierro 1/2\"", "Hierro 3/4\"", "Hierro 1\""],
    "Codos": ["Codo 90° 1/2\"", "Codo 45° 3/4\"", "Codo 90° 1\""],
    "Tees": ["Tee 1/2\"", "Tee 3/4\"", "Tee 1\""],
    "Uniones": ["Unión 1/2\"", "Unión 3/4\"", "Unión 1\""]
  };

  const materialOptions = [
    // Acero
    { cod: "AC-001", corta: "Varilla 1/4\"", larga: "Varilla corrugada 1/4\" Grado 60", unidad: "m", familia: "Varillas" },
    { cod: "AC-002", corta: "Perfil C 2x1", larga: "Perfil estructural C 2x1 pulgadas", unidad: "m", familia: "Perfiles" },
    // Tubería
    { cod: "TB-001", corta: "PVC 1/2\"", larga: "Tubería PVC 1/2\" para agua", unidad: "m", familia: "PVC" },
    { cod: "TB-002", corta: "Hierro 3/4\"", larga: "Tubería de hierro 3/4\"", unidad: "m", familia: "Hierro" },
    // Accesorios
    { cod: "ACC-001", corta: "Codo 90° 1/2\"", larga: "Codo PVC 90° 1/2\"", unidad: "unidad", familia: "Codos" },
    { cod: "ACC-002", corta: "Tee 3/4\"", larga: "Tee PVC 3/4\"", unidad: "unidad", familia: "Tees" }
  ];

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

  // Función para realizar la búsqueda
  const handleSearch = () => {
    if (searchInput || customMaterial) {
      setSearchLoading(true);
      setShowResults(true);
      
      // Simulamos un retraso de red
      setTimeout(() => {
        const searchTerm = (customMaterial || searchInput).toLowerCase();
        const filtered = materialOptions.filter(item =>
          item.corta.toLowerCase().includes(searchTerm) ||
          item.larga.toLowerCase().includes(searchTerm) ||
          item.cod.toLowerCase().includes(searchTerm)
        );
        
        setSuggestions(filtered);
        setSearchResultsCount(filtered.length);
        setSearchLoading(false);
        setPage(0);
      }, 800); // Retraso simulado de 800ms
    } else {
      setSuggestions([]);
      setSearchResultsCount(0);
      setShowResults(false);
    }
  };

  // Handlers actualizados
  const handleOption1Change = (event) => {
    setSelectedOption1(event.target.value);
    setSelectedOption2("");
    setSelectedOption3("");
    setSearchInput("");
    setCustomMaterial("");
    setSuggestions([]);
    setShowResults(false);
  };

  const handleOption2Change = (event) => {
    setSelectedOption2(event.target.value);
    setSelectedOption3("");
    setSearchInput("");
    setCustomMaterial("");
    setSuggestions([]);
    setShowResults(false);
  };

  const handleOption3Change = (event) => {
    setSelectedOption3(event.target.value);
    setSearchInput("");
    setCustomMaterial("");
    setSuggestions([]);
    setShowResults(false);
  };

  const handleAddMaterial = (material) => {
    if (!selectedMaterials.some(m => m.cod === material.cod)) {
      setSelectedMaterials(prev => [...prev, material]);
    } else {
      setSelectedMaterials(prev => prev.filter(m => m.cod !== material.cod));
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
  const isMaterialSelected = (cod) => {
    return selectedMaterials.some(m => m.cod === cod);
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
        {!showList ? (
          <>
            {/* Título "Materiales" */}
            <Typography variant="h7" component="h1" sx={{ color: 'black', fontWeight: 'bold', marginBottom: 4 }}>
              Materiales
            </Typography>

            {/* Selectores de búsqueda */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "30px", 
              marginBottom: "30px"
            }}>
              {/* ConBox 1: Acero/Tubería/Accesorios */}
              <Select
                value={selectedOption1}
                onChange={handleOption1Change}
                displayEmpty
                variant="outlined"
                sx={{ height: "50px" }}
              >
                <MenuItem value="" disabled>Familias</MenuItem>
                {options1.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
              </Select>

              {/* ConBox 2: Subcategorías */}
              <Select
                value={selectedOption2}
                onChange={handleOption2Change}
                displayEmpty
                variant="outlined"
                sx={{ height: "50px" }}
                disabled={!selectedOption1}
              >
                <MenuItem value="" disabled>SubFamilias</MenuItem>
                {selectedOption1 && options2[selectedOption1]?.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
              </Select>

              {/* ConBox 3: Especificaciones */}
              <Select
                value={selectedOption3}
                onChange={handleOption3Change}
                displayEmpty
                variant="outlined"
                sx={{ height: "50px" }}
                disabled={!selectedOption2}
              >
                <MenuItem value="" disabled>Categorias</MenuItem>
                {selectedOption2 && options3[selectedOption2]?.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
              </Select>

              {/* Buscador */}
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
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setCustomMaterial(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  label="Buscar material específico"
                  variant="outlined"
                  sx={{ height: "50px" }}
                  InputProps={{
                    endAdornment: searchInput && (
                      <IconButton
                        onClick={() => {
                          setSearchInput("");
                          setCustomMaterial("");
                          setSuggestions([]);
                          setShowResults(false);
                        }}
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

            {/* Tabla de resultados con paginación */}
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
                        suggestions
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((material) => (
                            <TableRow key={material.cod} hover>
                              <TableCell>{material.cod}</TableCell>
                              <TableCell>{material.corta}</TableCell>
                              <TableCell>{material.larga}</TableCell>
                              <TableCell>{material.unidad}</TableCell>
                              <TableCell>
                                <IconButton 
                                  color={isMaterialSelected(material.cod) ? "success" : "primary"}
                                  onClick={() => handleAddMaterial(material)}
                                >
                                  {isMaterialSelected(material.cod) ? <CheckIcon /> : <AddIcon />}
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
                
                {/* Paginación */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={suggestions.length}
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

            {/* Botón Siguiente */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                {selectedMaterials.length > 0 ? (
                  <span>Materiales seleccionados: {selectedMaterials.length}</span>
                ) : (
                  <Skeleton variant="text" width={150} />
                )}
              </div>
              <Button
                variant="contained"
                onClick={() => setShowList(true)}
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
          </>
        ) : (
          <ListaMaterial 
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            onBack={() => setShowList(false)}
          />
        )}
      </Paper>
    </div>
  );
};

export default DescripcionMaterial;