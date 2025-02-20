import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para la redirección
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import MainCard from "ui-component/cards/MainCard";
import { Button } from "@mui/material"; // Asegúrate de importar Button
import "../../assets/css/cronograma.css"; // Archivo CSS para colores

const Cronograma = () => {
  const ganttContainer = useRef(null);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    // Configurar idioma español
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

    // Configurar columnas con el botón de agregar tarea
    gantt.config.columns = [
      { name: "text", label: "Nom. Act.", width: 125, tree: true },
      { name: "start_date", label: "Inicio", align: "center", width: 100 },
      { name: "end_date", label: "Termino", align: "center", width: 100 },
      { name: "duration", label: "Días", align: "center", width: 50 },
      { name: "cantidad", label: "Cant", align: "center", width: 50 },
      { name: "unidad", label: "Unidad", align: "center", width: 50 },
      { name: "add", label: "", width: 44 }
    ];

    // Configurar el formulario de la tarea
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

    // Calcular la fecha de fin automáticamente si es necesario
    gantt.attachEvent("onTaskUpdated", function (id, task) {
      if (task.start_date && task.duration) {
        const startDate = new Date(task.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + task.duration);
        task.end_date = gantt.date.date_to_str("%d-%m-%Y")(endDate); // Formatear la fecha
        gantt.updateTask(id);
      }
    });

    // Definir colores según el nivel de la tarea
    gantt.templates.task_class = function (start, end, task) {
      const level = gantt.getTask(task.id).$level; // Obtener nivel jerárquico
      if (level === 0) return "nivel-0"; // Tarea principal
      if (level === 1) return "nivel-1"; // Subtarea
      if (level === 2) return "nivel-2"; // Sub-subtarea
      return "nivel-otros"; // Niveles más profundos
    };

    // Configurar la escala de tiempo
    gantt.config.scale_unit = "day"; // Mostrar días
    gantt.config.step = 1; // Un paso por día
    gantt.config.date_scale = "%d %M"; // Formato de la escala de tiempo

    // Definir el rango de tiempo inicial
    const startDate = new Date(); // Fecha de inicio hoy
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100); // Fecha de fin en 100 días

    gantt.config.start_date = startDate;
    gantt.config.end_date = endDate;

    // Inicializar el Gantt
    gantt.init(ganttContainer.current);

    // Agregar una tarea predeterminada de 100 días
    gantt.addTask({
      id: 1,
      text: "Tarea Inicial",
      start_date: gantt.date.date_to_str("%d-%m-%Y")(startDate),
      end_date: gantt.date.date_to_str("%d-%m-%Y")(endDate),
      duration: 100,
      cantidad: 1,
      unidad: "pzas"
    });

    return () => {
      gantt.clearAll();
    };
  }, []);

  return (
    <MainCard
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Cronograma</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px", // Bordes redondeados
                padding: "10px 20px",
                backgroundColor: "#060336",
                color: "white"
              }}
              onClick={() => navigate("/proyectos/AsignacionManoObra")} // Redireccionar al hacer clic
            >
              Siguiente
            </Button>
          </div>
        </div>
      }
    >
      <div ref={ganttContainer} style={{ width: "100%", height: "400px" }} />
    </MainCard>
  );
};

export default Cronograma;