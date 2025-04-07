import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import {
  Typography, TextField, Grid, Box, FormControl, Select, MenuItem, InputLabel, ToggleButton, ToggleButtonGroup, Button, Alert, AlertTitle,
  Checkbox, FormGroup, CircularProgress, Radio, RadioGroup, FormControlLabel
} from "@mui/material";
import { Engineering, Build, PrecisionManufacturing, Handyman, LocalAtm, Support } from "@mui/icons-material";
import MainCard from "ui-component/cards/MainCard";
import { CrearProyecto, getProyectoEdit, editarProyecto } from "../../api/Construccion";

// Importar datos de los combobox
import areas from "../../data/CPC/areas.json";
import edificios from "../../data/CPC/edificios.json";
import tiposAcabado from "../../data/CPC/tiposAcabado.json";
import opcionesDiseño from "../../data/CPC/opcionesDiseño.json";
import condicionesSeguridad from "../../data/CPC/condicionesSeguridad.json";
import documentosAnexos from "../../data/CPC/documentosAnexos.json";

// Mapear iconos por nombre
const iconComponents = { Engineering, Build, PrecisionManufacturing, Handyman, LocalAtm, Support };

const CPC = () => {
  // Estados del formulario
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
  const [imagen, setImagen] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [imagenOriginal, setImagenOriginal] = useState(null);

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { id_proyecto, id, nombreActividad, Status } = location.state || {};

  // Efecto para manejar conexión
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

  // Efecto para cargar datos de edición
  useEffect(() => {
    const loadEditData = async () => {
      if (Status && id_proyecto && !initialDataLoaded) {
        setIsEditing(true);
        setLoading(true);
        try {
          const response = await getProyectoEdit(id);
          const data = response;

          // Setear los valores del formulario con los datos obtenidos
          if (data.proyectoEditDto) {
            const proyecto = data.proyectoEditDto;
            setTipoAcabado(proyecto.tipo_acabados || "");
            setDescripcion(proyecto.descripcion || "");
            setPlacement(proyecto.area || "");
            setEdificio(proyecto.edificio || "");
            setEquipoReferencia(proyecto.equipo_referencia || "");
            setUbicacion(proyecto.ubicacion || "");
            setImagen(proyecto.enlace_documento || null);
            setImagenOriginal(proyecto.enlace_documento || null);
          }

          if (data.diseniosEditDtos) {
            const diseños = data.diseniosEditDtos.map(item => item.detalles_diseno);
            setSelected(diseños);
          }

          if (data.condicionSeguridadDtos) {
            const seguridad = data.condicionSeguridadDtos.map(item => item.detalles_CondicionSeguridad);
            setSeguridadSeleccionada(seguridad);
          }

          if (data.tipoDocumentosDtos) {
            const documentos = data.tipoDocumentosDtos.map(item => item.detalles_TiposDocumentos);
            setDocumentosAnexados(documentos);
          }

          setInitialDataLoaded(true);
        } catch (error) {
          console.error("Error al cargar datos para edición:", error);
          setErrorAlert("Error al cargar los datos del proyecto para edición.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadEditData();
  }, [Status, id_proyecto, initialDataLoaded]);

  // Manejadores de eventos
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

  const handleRemoveImage = () => {
    setImagen(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extraer solo la parte base64 (sin el prefijo data:image/...)
        const base64String = reader.result.split(',')[1];
        setImagen(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validación del formulario
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

  // Manejo del envío del formulario
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorAlert(null);

    const datosProyecto = {
      idNumero: id,
      tipoAcabados: tipoAcabado,
      descripcion: descripcion,
      area: placement,
      edificio: edificio,
      equipoReferencia: equipoReferencia,
      ubicacion: ubicacion,
      condicionSeguridad: seguridadSeleccionada,
      disenios: selected,
      tiposDocumentos: documentosAnexados,
      documento: isEditing
        ? (imagen === imagenOriginal ? null : imagen) // Lógica clave para el campo documento
        : imagen
    };

    // Si estamos editando, agregamos el id_proyecto
    if (isEditing) {
      datosProyecto.id_proyecto = id_proyecto;
    }
    console.log("Datos del proyecto:", datosProyecto);
    try {
      let response;
      if (isEditing) {
        response = await editarProyecto(datosProyecto);
      } else {
        response = await CrearProyecto(datosProyecto);
      }

      if (response.tipoError != 1) {
        if (isEditing) {
          navigate(-1);
        } else {
          const idproyecto = isEditing ? id_proyecto : Number(response.mensaje);
          navigate('/proyectos/cronograma', { state: { id_proyecto: idproyecto, Status: isEditing } });
        }

      } else {
        console.error(`Error al ${isEditing ? 'editar' : 'crear'} el proyecto:`, response.mensaje);
        setErrorAlert(`Error al ${isEditing ? 'editar' : 'crear'} el proyecto. Por favor intente nuevamente.`);
      }
    } catch (error) {
      console.error(`Error al ${isEditing ? 'editar' : 'crear'} el proyecto:`, error);
      setErrorAlert(`Error al ${isEditing ? 'editar' : 'crear'} el proyecto. Por favor intente nuevamente.`);
    } finally {
      setLoading(false);
    }
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

      <MainCard title={isEditing ? "Edición de CPC" : "Creación de CPC"} sx={{ textAlign: "center" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={nombreActividad}
                label="Nom proyecto"
                variant="outlined"
                sx={{ backgroundColor: "#FFFFF" }}
                disabled={isEditing}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              freeSolo
              options={tiposAcabado}
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
                {opcionesDiseño.map((item) => {
                  const IconComponent = iconComponents[item.icon];
                  return (
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
                      <IconComponent />
                      <Typography variant="caption">{item.label}</Typography>
                    </ToggleButton>
                  );
                })}
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
                {areas.map((area) => (
                  <MenuItem key={area} value={area}>{area}</MenuItem>
                ))}
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
                {edificios.map((edificio) => (
                  <MenuItem key={edificio} value={edificio}>{edificio}</MenuItem>
                ))}
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
                  {condicionesSeguridad.map((condicion) => (
                    <FormControlLabel
                      key={condicion}
                      control={
                        <Checkbox
                          checked={seguridadSeleccionada.includes(condicion)}
                          onChange={handleSeguridadChange}
                          value={condicion}
                        />
                      }
                      label={condicion}
                    />
                  ))}
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
                  {documentosAnexos.map((documento) => (
                    <FormControlLabel
                      key={documento}
                      control={
                        <Checkbox
                          checked={documentosAnexados.includes(documento)}
                          onChange={handleDocumentosAnexadosChange}
                          value={documento}
                        />
                      }
                      label={documento}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      <MainCard title="Subir Imagen" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                sx={{ backgroundColor: "#060336", color: "#fff", mr: 2 }}
              >
                {imagen ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Button>
            </label>
            {imagen && (
              <Button
                variant="contained"
                color="error"
                onClick={handleRemoveImage}
                sx={{ color: "#fff" }}
              >
                Eliminar Imagen
              </Button>
            )}
            {imagen && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Vista previa:</Typography>
                <img
                  src={imagen.includes('http') ? imagen : `data:image/jpeg;base64,${imagen}`}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </MainCard>

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