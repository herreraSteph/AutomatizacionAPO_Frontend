import React, { useState, useRef, useEffect } from "react"; // Añadir useEffect
import { useNavigate } from "react-router-dom"; // Usa useNavigate en lugar de useHistory
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import CronogramaManoObra from "./Gantt-Charts/CronogramaEmpleados";
import { Button, CircularProgress, Alert, AlertTitle } from "@mui/material"; // Importar Alert y AlertTitle
import { agregarEmpleados } from "../../api/Construccion";

const AsignacionManoObra = () => {
  const cronogramaRef = useRef(null);
  // Estado para controlar la visibilidad de ManoObraGantt
  const [showGantt, setShowGantt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para verificar la conexión a Internet

  // Hook useNavigate para la navegación
  const navigate = useNavigate();

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

  // Función para alternar la visibilidad
  const toggleGantt = () => {
    setShowGantt(!showGantt);
  };

  const obtenerDatosCronograma = async () => {
    if (cronogramaRef.current) {
      setIsLoading(true);
      try {
        const datos = cronogramaRef.current.exportData();
        const response = await agregarEmpleados(datos);
        if (response.tipoError === 0) {
          navigate("/proyectos/equipo");
        } else {
          console.error("Error al enviar los datos:", response.mensaje);
        }
        console.log(datos);
      } catch (error) {
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
        style={{ marginLeft: "10px" }} // Estilo opcional para separar los botones
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        Siguiente
      </Button>

      {/* Renderiza ManoObraGantt solo si showGantt es true */}
      {showGantt && <ManoObraGantt />}

      {/* CronogramaManoObra se muestra siempre */}
      <CronogramaManoObra ref={cronogramaRef} />
    </MainCard>
  );
};

export default AsignacionManoObra;