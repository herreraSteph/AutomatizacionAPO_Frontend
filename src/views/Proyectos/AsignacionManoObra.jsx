import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { agregarEmpleados, GetManoObraEdit } from "../../api/Construccion";

const AsignacionManoObra = () => {
  const cronogramaRef = useRef(null);
  const [showGantt, setShowGantt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [ganttData, setGanttData] = useState(null); // Estado para almacenar los datos del Gantt
  const location = useLocation();
  const { id_proyecto, Status } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificar el Status al montar el componente
    const fetchInitialData = async () => {
      if (Status) {
        try {
          setIsLoading(true);
          const data = await GetManoObraEdit(id_proyecto);
          setGanttData(data);
        } catch (error) {
          console.error('Error al obtener datos del Gantt:', error);
          setModalMessage("Error al cargar los datos iniciales");
          setOpenModal(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [Status, id_proyecto]);

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
        
        if (!datos || datos.groups.length === 0) {
          setModalMessage("Por favor complete el cronograma antes de continuar.");
          setOpenModal(true);
          setIsLoading(false);
          return;
        }

        const response = await agregarEmpleados(datos, id_proyecto);
        if (response.tipoError === 0) {
          navigate("/proyectos/equipo", {state: {id_proyecto, Status}});
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
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      <Button variant="contained" color="primary" onClick={toggleGantt}>
        {showGantt ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </Button>

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

      {showGantt && (
        <ManoObraGantt idProyecto={id_proyecto} />
      )}

      <CronogramaManoObra ref={cronogramaRef} initialData={Status ? ganttData : null} />
    </MainCard>
  );
};

export default AsignacionManoObra;