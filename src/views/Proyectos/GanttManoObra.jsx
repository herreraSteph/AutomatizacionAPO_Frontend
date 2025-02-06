import React, { useEffect, useRef } from "react";
import Tareas from "./Gantt-Charts/Tareas";
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
const GanttManoObra = () => {

  return (
    <MainCard title="Mano de Obra">
      <ManoObraGantt/>
      <Tareas />
    </MainCard>
  );
};

export default GanttManoObra;