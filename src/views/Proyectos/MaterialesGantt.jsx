import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import Equipo from "./Gantt-Charts/CronogramaEquipo";
import { Button } from "@mui/material"; // Importa el componente Button de Material-UI

const MaterialesGantt = () => {
  const [showGantt, setShowGantt] = useState(true);
  const navigate = useNavigate(); // Obtén la función navigate para la navegación

  const toggleGantt = () => {
    setShowGantt(!showGantt);
  };

  // Función para redireccionar a /proyectos/descripcionmaterial
  const redirectToDescripcionMaterial = () => {
    navigate("/proyectos/DescripcionMaterial"); // Usa navigate en lugar de history.push
  };

  return (
    <MainCard title="EQUIPO, MAQUINARIA, HERRAMIENTA Y MATERIALES">
      {/* Botón para mostrar/ocultar ManoObraGantt */}
      <Button variant="contained" color="primary" onClick={toggleGantt} style={{ marginRight: '10px' }}>
        {showGantt ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </Button>

      {/* Botón para redireccionar a /proyectos/descripcionmaterial */}
      <Button variant="contained" color="secondary" onClick={redirectToDescripcionMaterial}>
        Siguiente
      </Button>

      {/* Renderiza ManoObraGantt solo si showGantt es true */}
      {showGantt && <ManoObraGantt />}

      <br />

      {/* Equipo se muestra siempre */}
      <Equipo />
    </MainCard>
  );
};

export default MaterialesGantt;