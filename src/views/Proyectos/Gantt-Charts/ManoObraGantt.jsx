
import data from '../../../data/cronograma'; // Importar el archivo JSON
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import "../../../assets/css/cronograma.css";

const ManoObraGannt = () => {
  const ganttContainer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gantt.locale = {
      date: {
        month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      },
      labels: {
        new_task: "Nueva tarea",
        icon_save: "Guardar",
        icon_cancel: "Cancelar",
        icon_details: "Detalles",
        icon_edit: "Editar",
        icon_delete: "Eliminar",
        confirm_closing: "Se perderán los cambios, ¿desea continuar?",
        confirm_deleting: "La tarea se eliminará permanentemente, ¿continuar?",
        section_description: "Descripción",
        section_time: "Duración",
        section_quantity: "Cantidad",
        section_unit: "Unidad",
        section_type: "Tipo",
        day: "Día",
        week: "Semana",
        month: "Mes",
        year: "Año",
      }
    };

    gantt.config.columns = [
      { name: "text", label: "Nom. Act.", width: 125, tree: true },
      { name: "start_date", label: "Inicio", align: "center", width: 100 },
      { name: "end_date", label: "Término", align: "center", width: 100 },
      { name: "duration", label: "Días", align: "center", width: 50 },
      { name: "cantidad", label: "Cant", align: "center", width: 50 },
      { name: "unidad", label: "Unidad", align: "center", width: 50 },
      { name: "add", label: "", width: 44 }
    ];

    gantt.config.lightbox.sections = [
      { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
      { name: "time", height: 72, map_to: "auto", type: "time" },
      { name: "quantity", label: "Cantidad", height: 40, map_to: "cantidad", type: "textarea" },
      { 
        name: "unit", label: "Unidad", height: 40, map_to: "unidad", type: "select",
        options: [
          { key: "pzas", label: "Pzas" },
          { key: "lote", label: "Lote" },
          { key: "act", label: "Act" },
          { key: "jts", label: "Jts" }
        ]
      }
    ];

    gantt.templates.task_class = function (start, end, task) {
      const level = gantt.getTask(task.id).$level;
      if (level === 0) return "nivel-0";
      if (level === 1) return "nivel-1";
      if (level === 2) return "nivel-2";
      return "nivel-otros";
    };

    gantt.config.scale_unit = "day";
    gantt.config.step = 1;
    gantt.config.date_scale = "%d %M";

    gantt.init(ganttContainer.current);
    gantt.parse(data); // Cargar datos del JSON

    return () => {
      gantt.clearAll();
    };
  }, []);

  return (
    <div ref={ganttContainer} style={{ width: "100%", height: "400px" }} />
  );
};

export default ManoObraGannt;
