import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Usa useNavigate en lugar de useHistory
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import CronogramaManoObra from "./Gantt-Charts/CronogramaEmpleados";
import { Button } from "@mui/material"; // Importa el componente Button de Material-UI

const AsignacionManoObra = () => {
  // Estado para controlar la visibilidad de ManoObraGantt
  const [showGantt, setShowGantt] = useState(true);

  // Hook useNavigate para la navegación
  const navigate = useNavigate();

  // Función para alternar la visibilidad
  const toggleGantt = () => {
    setShowGantt(!showGantt);
  };

  // Función para redirigir a /proyectos/equipo
  const redirectToEquipo = () => {
    navigate("/proyectos/equipo"); // Usa navigate en lugar de history.push
  };

  return (
    <MainCard title="Asignación de Mano de Obra">
      {/* Botón para mostrar/ocultar ManoObraGantt */}
      <Button variant="contained" color="primary" onClick={toggleGantt}>
        {showGantt ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </Button>

      {/* Botón para redirigir a /proyectos/equipo */}
      <Button
        variant="contained"
        color="secondary"
        onClick={redirectToEquipo}
        style={{ marginLeft: "10px" }} // Estilo opcional para separar los botones
      >
        Siguiente
      </Button>

      {/* Renderiza ManoObraGantt solo si showGantt es true */}
      {showGantt && <ManoObraGantt />}

      {/* CronogramaManoObra se muestra siempre */}
      <CronogramaManoObra />
    </MainCard>
  );
};

export default AsignacionManoObra;