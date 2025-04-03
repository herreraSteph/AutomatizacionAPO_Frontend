import React, { useState, useRef, useEffect } from "react"; // Añadir useEffect
import { useNavigate, useLocation } from "react-router-dom"; // Importa useNavigate para la navegación
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import Equipo from "./Gantt-Charts/CronogramaEquipo";
import { 
  Button, 
  CircularProgress, 
  Alert, 
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from "@mui/material";
import { agregarEquipo } from "../../api/Construccion";

const MaterialesGantt = () => {
  const cronogramaRef = useRef(null);
  const [showGantt, setShowGantt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para verificar la conexión a Internet
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal
  const navigate = useNavigate(); // Obtén la función navigate para la navegación
    const location = useLocation();
    const { id_proyecto, Status } = location.state || {};

  // Verificar la conexión a Internet
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

  const toggleGantt = () => {
    setShowGantt(!showGantt);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const guardarDatos = async () => {
    if (cronogramaRef.current) {
      setIsLoading(true);
      try {
        const datos = cronogramaRef.current.exportData();

        if (!datos || datos.groups.length === 0) {
          setModalMessage("Por favor complete el cronograma antes de continuar.");
          setOpenModal(true);
          setIsLoading(false);
          return;
        }
        const response = await agregarEquipo(datos, id_proyecto);
        if (response.tipoError === 0) {
          navigate("/proyectos/DescripcionMaterial",{state: {id_proyecto, Status}});
        } else {
          console.error("Error al enviar los datos:", response.mensaje);
        }
      } catch (error) {
        setModalMessage("Error al procesar la solicitud. Por favor intente nuevamente.");
        setOpenModal(true);
        console.error('Error al agregar empleados:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <MainCard title="EQUIPO, MAQUINARIA, HERRAMIENTA Y MATERIALES">
      {/* Alerta de conexión a Internet */}
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      {/* Botón para mostrar/ocultar ManoObraGantt */}
      <Button variant="contained" color="primary" onClick={toggleGantt} style={{ marginRight: '10px' }}>
        {showGantt ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </Button>

      {/* Botón para redireccionar a /proyectos/descripcionmaterial */}
      <Button variant="contained" 
              color="primary" 
              onClick={guardarDatos}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}>
        Siguiente
      </Button>

      {/* Modal para mostrar mensajes */}
            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
               <DialogTitle id="alert-dialog-title">
                <Typography variant="h3" component="h3">Atención</Typography>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {modalMessage}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary" autoFocus>
                  Aceptar
                </Button>
              </DialogActions>
            </Dialog>

      {/* Renderiza ManoObraGantt solo si showGantt es true */}
      {showGantt && <ManoObraGantt idProyecto={id_proyecto} />}

      <br />

      {/* Equipo se muestra siempre */}
      <Equipo ref={cronogramaRef}/>
    </MainCard>
  );
};

export default MaterialesGantt;