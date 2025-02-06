import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import "../../../assets/css/cronograma.css";
import indirecto from "../../../data/Indirecto-items.json";
import categorias from "../../../data/Taller-Cargill.json";

const EquipoGantt = () => {
  const ganttContainer = useRef(null);
  const [categoriaOptions, setCategoriaOptions] = useState([]);

  useEffect(() => {
    setCategoriaOptions(categorias);

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
        section_equipo: "Equipo",
        section_Hrs: "Horas",
        section_Jor: "Jornadas"
      }
    };

    gantt.config.columns = [
      { name: "text", label: "Equipo", width: 145, tree: true },
      { name: "Hrs", label: "Horas", align: "center", width: 80 },
      { name: "Jor", label: "Jornada", align: "center", width: 80 },
      { name: "start_date", label: "Fecha inicio", align: "center", width: 115 },
      { name: "add", label: "", width: 44 }
    ];

    gantt.config.lightbox.sections = [
      { 
        name: "equipo", 
        label: "Equipo", 
        map_to: "text", 
        type: "select", 
        options: categorias,
        onchange: function(event) {
          const value = event.target.value;
          const selectedIndirect = indirecto.find(ind => ind.key === value);
          const selectedCategory = categorias.find(cat => cat.key === value);
          if (selectedCategory) {
            gantt.getLightboxSection("HrsxJor").setValue(selectedCategory.hrs_x_jor);
          } else {
            gantt.getLightboxSection("HrsxJor").setValue(selectedIndirect.hrs_x_jor);
          }
        }
      },
      { name: "Hrs", label: "Jornada", height: 40, map_to: "HrsxJor", type: "textarea" },
      { name: "Jor", label: "Jornadas por dia", height: 40, map_to: "JorxDia", type: "textarea" },
      { name: "time", label: "JOR", height: 40, map_to: "auto", type: "duration" }
    ];

    gantt.attachEvent("onBeforeLightbox", function(id) {
      const task = gantt.getTask(id);
      if (task.parent === "1738794389747") {
        gantt.config.lightbox.sections[0].options = indirecto;
      } else {
        gantt.config.lightbox.sections[0].options = categorias; 
      }
      gantt.render();
      return true;
    });

    gantt.attachEvent("onTaskUpdated", function (id, task) {
      if (task.start_date && task.duration) {
        const startDate = new Date(task.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + task.duration);
        task.end_date = gantt.date.date_to_str("%d-%m-%Y")(endDate);
        gantt.updateTask(id);
      }
    });

    gantt.templates.task_class = function (start, end, task) {
      const level = gantt.getTask(task.id).$level;
      if (level === 0) return "nivel-0";
      if (level === 1) return "nivel-1";
      if (level === 2) return "nivel-2";
      return "nivel-otros";
    };

    gantt.init(ganttContainer.current);

    return () => {
      gantt.clearAll();
    };
  }, []);

  return (
    <div>
      <div ref={ganttContainer} style={{ width: "100%", height: "600px" }} />
    </div>
  );
};

export default EquipoGantt;