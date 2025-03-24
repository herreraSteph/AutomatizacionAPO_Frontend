import React, { useState, useRef, useEffect } from "react"; // Añadir useEffect
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import Equipo from "./Gantt-Charts/CronogramaEquipo";
import { Button, CircularProgress, Alert, AlertTitle } from "@mui/material"; // Importar Alert y AlertTitle
import { agregarEquipo } from "../../api/Construccion";

const MaterialesGantt = () => {
  const cronogramaRef = useRef(null);
  const [showGantt, setShowGantt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para verificar la conexión a Internet
  const navigate = useNavigate(); // Obtén la función navigate para la navegación

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

  const guardarDatos = async () => {
    if (cronogramaRef.current) {
      setIsLoading(true);
      try {
        const datos = cronogramaRef.current.exportData();
        const response = await agregarEquipo(datos);
        if (response.tipoError === 0) {
          navigate("/proyectos/DescripcionMaterial");
        } else {
          console.error("Error al enviar los datos:", response.mensaje);
        }
      } catch (error) {
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

      {/* Renderiza ManoObraGantt solo si showGantt es true */}
      {showGantt && <ManoObraGantt />}

      <br />

      {/* Equipo se muestra siempre */}
      <Equipo ref={cronogramaRef}/>
    </MainCard>
  );
};

export default MaterialesGantt;