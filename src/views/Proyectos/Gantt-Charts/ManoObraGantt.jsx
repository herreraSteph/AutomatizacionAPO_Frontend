import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import "../../../assets/css/cronograma.css";
import { obtenerActividades } from "../../../api/Construccion";

const ManoObraGannt = () => {
  const ganttContainer = useRef(null);
  const navigate = useNavigate();

  // Función para transformar los datos al formato esperado por DHTMLX Gantt
  const transformData = async () => {
    try {
      // Obtener las tareas desde la API
      const tasks = await obtenerActividades();

      // Verificar si hay datos
      if (!tasks || tasks.length === 0) {
        console.warn("No se recibieron tareas desde la API.");
        return { data: [], links: [] }; // Devolver un objeto vacío
      }

      // Transformar los datos al formato esperado por DHTMLX Gantt
      const transformedData = {
        data: tasks.map((task) => ({
          ...task,
          id: Number(task.id), // Convertir id a número
          parent: task.parent === "0" ? 0 : Number(task.parent), // Convertir parent a número
          start_date: task.start_date.replace("T", " "), // Formato YYYY-MM-DD HH:mm
          end_date: task.end_date.replace("T", " "), // Formato YYYY-MM-DD HH:mm
        })),
        links: [], // Array vacío para las dependencias (puedes omitirlo si no hay links)
      };

      return transformedData;
    } catch (error) {
      console.error("Error al transformar los datos:", error);
      return { data: [], links: [] }; // Devolver un objeto vacío en caso de error
    }
  };

  useEffect(() => {
    // Configuración de localización
    gantt.locale = {
      date: {
        month_full: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        month_short: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        day_full: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
        day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
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
      },
    };

    // Configuración de columnas
    gantt.config.columns = [
      { name: "text", label: "Nom. Act.", width: 125, tree: true },
      { name: "start_date", label: "Inicio", align: "center", width: 100 },
      { name: "duration", label: "Días", align: "center", width: 50 },
      { name: "cantidad", label: "Cant", align: "center", width: 50 },
      { name: "unidad", label: "Unidad", align: "center", width: 50 },
      { name: "add", label: "", width: 44 },
    ];

    // Configuración del lightbox
    gantt.config.lightbox.sections = [
      {
        name: "description",
        height: 70,
        map_to: "text",
        type: "textarea",
        focus: true,
      },
      { name: "time", height: 72, map_to: "auto", type: "duration" },
      {
        name: "quantity",
        label: "Cantidad",
        height: 40,
        map_to: "cantidad",
        type: "textarea",
      },
      {
        name: "unit",
        label: "Unidad",
        height: 40,
        map_to: "unidad",
        type: "select",
        options: [
          { key: "pzas", label: "Pzas" },
          { key: "lote", label: "Lote" },
          { key: "act", label: "Act" },
          { key: "jts", label: "Jts" },
        ],
      },
    ];

    // Plantilla para clases de tareas
    gantt.templates.task_class = function (start, end, task) {
      const level = gantt.getTask(task.id).$level;
      if (level === 0) return "nivel-0";
      if (level === 1) return "nivel-1";
      if (level === 2) return "nivel-2";
      return "nivel-otros";
    };

    // Configuración de la escala de tiempo
    gantt.config.scale_unit = "day";
    gantt.config.step = 1;
    gantt.config.date_scale = "%d %M";

    // Configurar el formato de fecha para que use YYYY-MM-DD HH:mm
    gantt.config.date_format = "%Y-%m-%d %H:%i";

    // Resaltar los fines de semana
    gantt.templates.scale_cell_class = function (date) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return "weekend";
      }
      return "";
    };

    // Inicializar el Gantt
    gantt.init(ganttContainer.current);

    // Función asíncrona para cargar y transformar los datos
    const loadData = async () => {
      try {
        const formattedData = await transformData(); // Esperar a que se resuelva la promesa
        gantt.parse(formattedData); // Cargar los datos en el Gantt
      } catch (error) {
        console.error("Error al cargar los datos en el Gantt:", error);
      }
    };

    // Llamar a la función asíncrona
    loadData();

    // Limpiar al desmontar
    return () => {
      gantt.clearAll();
    };
  }, []);

  return (
    <div ref={ganttContainer} style={{ width: "100%", height: "400px" }} />
  );
};

export default ManoObraGannt;