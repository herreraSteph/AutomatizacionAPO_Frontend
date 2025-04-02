import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete'; 
import {
  Typography,
  TextField,
  Grid,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Alert,
  AlertTitle,
  Checkbox,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Engineering,
  Build,
  PrecisionManufacturing,
  Handyman,
  LocalAtm,
  Support,
  CloudUpload,
  InsertDriveFile,
  Delete
} from "@mui/icons-material";
import MainCard from "ui-component/cards/MainCard";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

const options = [
  { label: "Ingeniería", icon: <Engineering /> },
  { label: "Fabricación", icon: <Build /> },
  { label: "Suministro", icon: <PrecisionManufacturing /> },
  { label: "Instalación", icon: <Handyman /> },
  { label: "Libranza", icon: <LocalAtm /> },
  { label: "Soportería", icon: <Support /> },
];

const CPC = () => {
  const [selected, setSelected] = useState([]);
  const [placement, setPlacement] = useState("");
  const [edificio, setEdificio] = useState("");
  const [equipoReferencia, setEquipoReferencia] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [seguridadSeleccionada, setSeguridadSeleccionada] = useState([]);
  const [tipoAcabado, setTipoAcabado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [files, setFiles] = useState([]);
  const [documentosAnexados, setDocumentosAnexados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { id, nombreActividad } = location.state || {};

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSelection = (event, newSelection) => {
    setSelected(newSelection);
  };

  const handlePlacementChange = (event) => {
    setPlacement(event.target.value);
  };

  const handleEdificioChange = (event) => {
    setEdificio(event.target.value);
  };

  const handleEquipoReferenciaChange = (event) => {
    setEquipoReferencia(event.target.value);
  };

  const handleUbicacionChange = (event) => {
    setUbicacion(event.target.value);
  };

  const handleSeguridadChange = (event) => {
    const value = event.target.value;
    setSeguridadSeleccionada(prev =>
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  const handleDocumentosAnexadosChange = (event) => {
    const value = event.target.value;
    setDocumentosAnexados(prev =>
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleTipoAcabadoChange = (event) => {
    setTipoAcabado(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!tipoAcabado) {
      newErrors.tipoAcabado = "El Tipo de Acabado es Requerido.";
    }
    if (!descripcion) {
      newErrors.descripcion = "La Descripción es Requerida.";
    }
    if (!placement) {
      newErrors.placement = "El Area es Requerida.";
    }
    if (!edificio) {
      newErrors.edificio = "El Edificio es Requerido.";
    }
    if (!equipoReferencia) {
      newErrors.equipoReferencia = "El Equipo de Referencia es Requerido.";
    }
    if (!ubicacion) {
      newErrors.ubicacion = "La Ubicación es Requerida.";
    }
    if (seguridadSeleccionada.length === 0) {
      newErrors.seguridadSeleccionada = "La Condición de Seguridad es Requerida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
////aqui cambia
const handleSave = () => {
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setErrorAlert(null);

  const requestData = {
    idNumero: id,
    tipoAcabados: tipoAcabado,
    descripcion: descripcion,
    area: placement,
    edificio: edificio,
    equipoReferencia: equipoReferencia,
    ubicacion: ubicacion,
    condicionSeguridad: seguridadSeleccionada,
    disenios: selected.map(item => item.label),
    tiposDocumentos: documentosAnexados // Cambiado de files.map(...) a documentosAnexados
  };

  fetch("https://automatizacionapo-backend.onrender.com/api/Construccion/CrearProyecto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.mensaje) {
        const idproyecto = Number(data.mensaje); 
        navigate('/proyectos/cronograma', {state: {id_proyecto: idproyecto, Status: false}});
      }
    })
    .catch(error => {
      console.error("Error al crear el proyecto:", error);
      setErrorAlert("Error al crear el proyecto. Por favor intente nuevamente.");
    })
    .finally(() => {
      setLoading(false);
    });
};
  return (
    <Box sx={{ p: 2 }}>
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

{errorAlert && (
  <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setErrorAlert(null)}>
    <AlertTitle>Error</AlertTitle>
    {errorAlert}
  </Alert>
)}

      <MainCard title="Creación de CPC" sx={{ textAlign: "center" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={nombreActividad}
                label="Nom proyecto"
                variant="outlined"
                sx={{ backgroundColor: "#FFFFF" }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              options={[
                "ALQUIDALICO",
                "AISLAMIENTO",
                "EPOXICO",
                "GALVANIZADO EN FRIO",
                "GALVANIZADO POR INMERSION EN CALIENTE",
                "NA"
              ]}
              value={tipoAcabado}
              onChange={(event, newValue) => {
                handleTipoAcabadoChange({ target: { value: newValue } });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Tipo de Acabados"
                  variant="outlined"
                  sx={{ backgroundColor: "#ffffff" }}
                  error={!!errors.tipoAcabado}
                  onChange={(e) => handleTipoAcabadoChange(e)}
                />
              )}
            />
            {errors.tipoAcabado && <Typography color="error">{errors.tipoAcabado}</Typography>}
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <FormControl>
              <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                Detalles de Diseño y Materiales en Anexo  
              </Typography>
              <ToggleButtonGroup
                value={selected}
                onChange={handleSelection}
                sx={{ display: "flex", flexWrap: "wrap" }}
              >
                {options.map((item) => (
                  <ToggleButton
                    key={item.label}
                    value={item.label}
                    sx={{
                      borderRadius: "50%",
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "20px",
                      marginLeft: "40px",
                      color: "black",
                      "&.Mui-selected": {
                        backgroundColor: "#060336",
                        color: "#fff",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography variant="caption">{item.label}</Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-start">
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              multiline
              rows={4}
              value={descripcion}
              onChange={handleDescripcionChange}
              sx={{
                backgroundColor: "#fffff",
                maxWidth: "400px",
                height: "100%",
                marginTop: "-115px",
              }}
              error={!!errors.descripcion}
            />
            {errors.descripcion && <Typography color="error">{errors.descripcion}</Typography>}
          </Grid>
        </Grid>
      </MainCard>

      <MainCard title="Ubicación" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Area</InputLabel>
              <Select
                value={placement}
                onChange={handlePlacementChange}
                label="Area"
                sx={{ backgroundColor: "#F2ECF5" }}
                error={!!errors.placement}
              >
                <MenuItem value="CRUSH">CRUSH</MenuItem>
                <MenuItem value="CORN MILLING">CORN MILLING</MenuItem>
                <MenuItem value="REFINERIA">REFINERIA</MenuItem>
                <MenuItem value="EMPAQUE">EMPAQUE</MenuItem>
                <MenuItem value="CONTRATISTAS">CONTRATISTAS</MenuItem>
              </Select>
              {errors.placement && <Typography color="error">{errors.placement}</Typography>}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Edificio</InputLabel>
              <Select
                value={edificio}
                onChange={handleEdificioChange}
                label="Edificio"
                sx={{ backgroundColor: "#F2ECF5" }}
                error={!!errors.edificio}
              >
                <MenuItem value="PREPARACION">PREPARACION</MenuItem>
                <MenuItem value="PRELIMPIA">PRELIMPIA</MenuItem>
                <MenuItem value="REFINERIA">REFINERIA</MenuItem>
                <MenuItem value="EXTRACCION">EXTRACCION</MenuItem>
                <MenuItem value="CALDERAS">CALDERAS</MenuItem>
                <MenuItem value="EMPAQUE">EMPAQUE</MenuItem>
                <MenuItem value="HARINAS">HARINAS</MenuItem>
                <MenuItem value="CARRO TOLVAS">CARRO TOLVAS</MenuItem>
                <MenuItem value="LAVADO DE PIPAS">LAVADO DE PIPAS</MenuItem>
                <MenuItem value="CARGA DE PIPAS">CARGA DE PIPAS</MenuItem>
                <MenuItem value="DESCARGA DE PIPAS">DESCARGA DE PIPAS</MenuItem>
                <MenuItem value="BLANQUEO REFINERIA">BLANQUEO REFINERIA</MenuItem>
                <MenuItem value="MEZZANINE REFINERIA">MEZZANINE REFINERIA</MenuItem>
                <MenuItem value="PLANTA BAJA REFINERIA">PLANTA BAJA REFINERIA</MenuItem>
                <MenuItem value="EDIF. DESMET">EDIF. DESMET</MenuItem>
                <MenuItem value="EDIF. DEODO VOTATOR">EDIF. DEODO VOTATOR</MenuItem>
                <MenuItem value="DIQUE PRODUCTO TERMINADO">DIQUE PRODUCTO TERMINADO</MenuItem>
                <MenuItem value="DIQUE DE CRUDO">DIQUE DE CRUDO</MenuItem>
                <MenuItem value="HIDROGENACION">HIDROGENACION</MenuItem>
                <MenuItem value="INTERESTERIFICADO">INTERESTERIFICADO</MenuItem>
                <MenuItem value="PTAR HARINAS">PTAR HARINAS</MenuItem>
                <MenuItem value="PTAR CORN MILLING">PTAR CORN MILLING</MenuItem>
                <MenuItem value="OFICINAS GENERALES">OFICINAS GENERALES</MenuItem>
                <MenuItem value="VELARIA">VELARIA</MenuItem>
                <MenuItem value="DAF">DAF</MenuItem>
              </Select>
              {errors.edificio && <Typography color="error">{errors.edificio}</Typography>}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel></InputLabel>
              <TextField
                value={equipoReferencia}
                onChange={handleEquipoReferenciaChange}
                label="Equipo de Referencia"
                variant="outlined"
                sx={{ backgroundColor: "#FFFFF" }}
                error={!!errors.equipoReferencia}
              />
              {errors.equipoReferencia && <Typography color="error">{errors.equipoReferencia}</Typography>}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Ubicación
              </Typography>
              <RadioGroup
                aria-label="ubicacion"
                name="ubicacion"
                value={ubicacion}
                onChange={handleUbicacionChange}
              >
                <FormControlLabel value="Interior" control={<Radio />} label="Interior" />
                <FormControlLabel value="Exterior" control={<Radio />} label="Exterior" />
              </RadioGroup>
              {errors.ubicacion && <Typography color="error">{errors.ubicacion}</Typography>}
            </FormControl>
          </Grid>
        </Grid>
      </MainCard>



      <Grid item xs={12} md={6}>
          <MainCard title="Condición de Seguridad" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={seguridadSeleccionada.includes("Trabajo en altura")}
                          onChange={handleSeguridadChange}
                          value="Trabajo en altura"
                        />
                      }
                      label="Trabajo en Altura"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={seguridadSeleccionada.includes("Espacio confinado")}
                          onChange={handleSeguridadChange}
                          value="Espacio confinado"
                        />
                      }
                      label="Espacio confinado"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={seguridadSeleccionada.includes("Medidores atmosf.")}
                          onChange={handleSeguridadChange}
                          value="Medidores atmosf."
                        />
                      }
                      label="Medidores atmosf."
                    />
                  </FormGroup>
                  {errors.seguridadSeleccionada && (
                    <Typography color="error">{errors.seguridadSeleccionada}</Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
  <MainCard title="Documentos Anexados A CPC" sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={documentosAnexados.includes("Planos o Dibujos")}
                  onChange={handleDocumentosAnexadosChange}
                  value="Planos o Dibujos"
                />
              }
              label="Planos o Dibujos"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={documentosAnexados.includes("Rep.Fotografico")}
                  onChange={handleDocumentosAnexadosChange}
                  value="Rep.Fotografico"
                />
              }
              label="Rep.Fotografico"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={documentosAnexados.includes("Lista de Material")}
                  onChange={handleDocumentosAnexadosChange}
                  value="Lista de Material"
                />
              }
              label="Lista de Material"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={documentosAnexados.includes("Otro")}
                  onChange={handleDocumentosAnexadosChange}
                  value="Otro"
                />
              }
              label="Otro"
            />
          </FormGroup>
        </FormControl>
      </Grid>
    </Grid>
  </MainCard>
</Grid>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", width: "100%" }}>
      <Button 
  variant="contained" 
  onClick={handleSave} 
  sx={{ backgroundColor: "#060336", width: "15%" }}
  disabled={loading}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
</Button>
      </div>
    </Box>
  );
};

export default CPC;