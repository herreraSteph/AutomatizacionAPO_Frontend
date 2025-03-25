import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import CronogramaManoObra from "./Gantt-Charts/CronogramaEmpleados";
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
import { agregarEmpleados } from "../../api/Construccion";

const AsignacionManoObra = () => {
  const cronogramaRef = useRef(null);
  const [showGantt, setShowGantt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal

  const navigate = useNavigate();

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

  const obtenerDatosCronograma = async () => {
    if (cronogramaRef.current) {
      setIsLoading(true);
      try {
        const datos = cronogramaRef.current.exportData();
        
        // Validar si hay datos en el cronograma
        // Validación robusta de los datos

      if (!datos || datos.groups.length === 0) {
        setModalMessage("Por favor complete el cronograma antes de continuar.");
        setOpenModal(true);
        setIsLoading(false);
        return;
      }

        const response = await agregarEmpleados(datos);
        if (response.tipoError === 0) {
          navigate("/proyectos/equipo");
        } else {
          setModalMessage(response.mensaje || "Error al enviar los datos");
          setOpenModal(true);
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
    <MainCard title="Asignación de Mano de Obra">
      {/* Alerta de conexión a Internet */}
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      {/* Botón para mostrar/ocultar ManoObraGantt */}
      <Button variant="contained" color="primary" onClick={toggleGantt}>
        {showGantt ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </Button>

      {/* Botón para redirigir a /proyectos/equipo */}
      <Button
        variant="contained"
        color="secondary"
        onClick={obtenerDatosCronograma}
        style={{ marginLeft: "10px" }}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
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
      {showGantt && <ManoObraGantt />}

      {/* CronogramaManoObra se muestra siempre */}
      <CronogramaManoObra ref={cronogramaRef} />
    </MainCard>
  );
};

export default AsignacionManoObra;