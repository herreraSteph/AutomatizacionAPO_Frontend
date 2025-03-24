import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import MainCard from "ui-component/cards/MainCard";
import { Button, CircularProgress, Modal, Box, Typography, Alert, AlertTitle } from "@mui/material";
import "../../assets/css/cronograma.css";
import { agregarActividades } from "../../api/Construccion";

const Cronograma = () => {
  const ganttContainer = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [modalTitle, setModalTitle] = useState("Error");

  useEffect(() => {
    // Configuración regional
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

    // Configuración para el comportamiento padre/hijo
    gantt.config.auto_types = true;
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = false;
    gantt.config.duration_unit = "day";
    gantt.config.work_time = false;
    gantt.config.drag_move = true;
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;

    // Configuración de columnas
    gantt.config.columns = [
      { name: "text", label: "Nom. Act.", width: 125, tree: true },
      { name: "start_date", label: "Inicio", align: "center", width: 100 },
      { name: "duration", label: "Días", align: "center", width: 50 },
      { name: "cantidad", label: "Cant", align: "center", width: 50 },
      { name: "unidad", label: "Unidad", align: "center", width: 50 },
      { name: "add", label: "", width: 44 }
    ];

    // Configuración del lightbox
    gantt.config.lightbox.sections = [
      { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
      { name: "time", height: 72, map_to: "auto", type: "duration" },
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

    // Función para aplicar restricciones padre/hijo
    const applyParentChildConstraints = (task) => {
      if (task.parent) {
        const parent = gantt.getTask(task.parent);
        const parentStart = new Date(parent.start_date);
        const parentEnd = new Date(parent.start_date);
        parentEnd.setDate(parentStart.getDate() + parent.duration);
        
        const taskStart = new Date(task.start_date);
        const taskEnd = new Date(task.start_date);
        taskEnd.setDate(taskStart.getDate() + task.duration);
        
        let changed = false;
        
        // Restricción de fecha de inicio
        if (taskStart < parentStart) {
          task.start_date = new Date(parentStart);
          changed = true;
        }
        
        // Restricción de fecha final
        if (taskEnd > parentEnd) {
          const maxDuration = Math.floor((parentEnd - new Date(task.start_date)) / (1000 * 60 * 60 * 24));
          task.duration = maxDuration > 0 ? maxDuration : 1;
          changed = true;
        }
        
        return changed;
      }
      return false;
    };

    // Evento al arrastrar tareas
    gantt.attachEvent("onTaskDrag", function(id, mode, task) {
      if (applyParentChildConstraints(task)) {
        gantt.updateTask(id);
        return false;
      }
      return true;
    });

    // Evento antes de soltar la tarea
    gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e) {
      const task = gantt.getTask(id);
      if (applyParentChildConstraints(task)) {
        gantt.updateTask(id);
      }
      return true;
    });

    // Evento al redimensionar tareas
    gantt.attachEvent("onBeforeTaskChange", function(id, mode, task) {
      if (mode === "resize") {
        if (applyParentChildConstraints(task)) {
          return false;
        }
      }
      return true;
    });

    // Evento al actualizar tareas
    gantt.attachEvent("onAfterTaskUpdate", function(id, task) {
      // Ajustar tareas hijas si es un padre
      if (gantt.hasChild(id)) {
        const children = gantt.getChildren(id);
        children.forEach(childId => {
          const child = gantt.getTask(childId);
          if (applyParentChildConstraints(child)) {
            gantt.updateTask(childId);
          }
        });
      }
      
      // Ajustar la tarea actual si es una hija
      if (task.parent) {
        if (applyParentChildConstraints(task)) {
          gantt.updateTask(id);
        }
      }
    });

    // Actualizar fecha final al modificar tarea
    gantt.attachEvent("onTaskUpdated", function(id, task) {
      if (task.start_date && task.duration) {
        const startDate = new Date(task.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + task.duration);
        task.end_date = gantt.date.date_to_str("%d-%m-%Y %H:%i")(endDate);
        gantt.updateTask(id);
      }
    });

    // Estilos para niveles de tareas
    gantt.templates.task_class = function(start, end, task) {
      const level = gantt.getTask(task.id).$level;
      if (level === 0) return "nivel-0";
      if (level === 1) return "nivel-1";
      if (level === 2) return "nivel-2";
      return "nivel-otros";
    };

    // Configuración de escala de tiempo
    gantt.config.scale_unit = "day";
    gantt.config.step = 1;
    gantt.config.date_scale = "%d %M";
    gantt.config.date_format = "%Y-%m-%d %H:%i";

    // Estilos para fines de semana
    gantt.templates.scale_cell_class = function(date) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return "weekend";
      }
      return "";
    };

    // Rango inicial del diagrama
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100);

    gantt.config.start_date = startDate;
    gantt.config.end_date = endDate;

    // Inicializar Gantt
    gantt.init(ganttContainer.current);

    return () => {
      gantt.clearAll();
    };
  }, []);

  const validateData = (tasks) => {
    if (tasks.length === 0) {
      return {
        valid: false,
        message: "No hay tareas para exportar. Por favor, agregue al menos una tarea antes de continuar."
      };
    }
    for (const task of tasks) {
      if (!task.text || task.text.trim() === "") {
        return {
          valid: false,
          message: `La tarea con ID ${task.id} no tiene nombre. Por favor, ingrese un nombre válido.`
        };
      }

      if (!task.start_date) {
        return {
          valid: false,
          message: `La tarea "${task.text}" no tiene fecha de inicio. Por favor, ingrese una fecha válida.`
        };
      }

      if (isNaN(task.duration) || task.duration <= 0) {
        return {
          valid: false,
          message: `La tarea "${task.text}" tiene una duración inválida. Por favor, ingrese un número positivo.`
        };
      }

      if (task.cantidad && isNaN(task.cantidad)) {
        return {
          valid: false,
          message: `La tarea "${task.text}" tiene una cantidad inválida. Por favor, ingrese un número válido.`
        };
      }

      if ((task.cantidad && !task.unidad) || (!task.cantidad && task.unidad)) {
        return {
          valid: false,
          message: `La tarea "${task.text}" debe tener tanto cantidad como unidad, o ninguno de los dos.`
        };
      }
    }
    return { valid: true };
  };

  const exportGanttData = async () => {
    setLoading(true);
    const tasks = gantt.getTaskByTime();

    const validation = validateData(tasks);
    if (!validation.valid) {
      setModalTitle("Validación requerida");
      setModalMessage(validation.message);
      setModalOpen(true);
      setLoading(false);
      return;
    }

    const data = tasks.map(task => ({
      id: task.id,
      start_date: gantt.date.date_to_str("%d-%m-%Y %H:%i")(new Date(task.start_date)),
      text: task.text,
      duration: task.duration,
      parent: task.parent || "0",
      end_date: gantt.date.date_to_str("%d-%m-%Y %H:%i")(new Date(task.end_date)),
      progress: task.progress || 0,
      cantidad: task.cantidad || "",
      unidad: task.unidad || ""
    }));

    try {
      const response = await agregarActividades(data);
      console.log(response);

      if (response.tipoError === 0) {
        navigate("/proyectos/AsignacionManoObra");
      } else {
        setModalTitle("Error");
        setModalMessage("Algo ocurrió mal. Por favor, inténtelo de nuevo.");
        setModalOpen(true);
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Cronograma</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "5px",
                padding: "10px 20px",
                backgroundColor: "#060336",
                color: "white"
              }}
              onClick={exportGanttData}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Siguiente"}
            </Button>
          </div>
        </div>
      }
    >
      {!isOnline && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <AlertTitle>Advertencia</AlertTitle>
          Parece que no estás conectado a Internet.
        </Alert>
      )}

      <div ref={ganttContainer} style={{ width: "100%", height: "400px" }} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px"
          }}
        >
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {modalTitle}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            pt: 2
          }}>
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: "#060336", 
                color: "white",
                "&:hover": { backgroundColor: "#040225" }
              }}
              onClick={() => setModalOpen(false)}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </MainCard>
  );
};

export default Cronograma;