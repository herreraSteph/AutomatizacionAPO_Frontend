import React, { useEffect, useRef } from "react";
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import EquipoGantt from "./Gantt-Charts/EquipoGantt";
const MaterialesGantt = () => {

  return (
    <MainCard title="EQUIPO, MAQUINARIA, HERRAMIENTA Y MATERIALES">
      <ManoObraGantt/>
      <EquipoGantt/>
    </MainCard>
  );
};

export default MaterialesGantt;