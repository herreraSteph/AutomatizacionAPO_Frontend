import React from "react";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import MainCard from "ui-component/cards/MainCard";
import datas from "../../../data/cronograma.json";

// Función para convertir la fecha de dd-mm-yyyy hh:mm a yyyy-mm-ddThh:mm:ss
const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split(" ")[0].split("-");
  const time = dateStr.split(" ")[1] || "00:00";
  return `${year}-${month}-${day}T${time}:00`;
};

// Función para obtener el nivel de jerarquía basado en el parent
const getTaskLevel = (task, tasks) => {
  if (task.parent === 0) return 0; // Tarea principal
  // Verificar cuántos niveles de profundidad tiene basándonos en su padre
  let level = 1;
  let parentTask = tasks.find(t => t.id === task.parent);
  while (parentTask && parentTask.parent !== 0) {
    level++;
    parentTask = tasks.find(t => t.id === parentTask.parent);
  }
  return level;
};

// Función para calcular la cantidad de días entre las fechas de inicio y fin
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end - start;
  return timeDifference / (1000 * 3600 * 24); // Convertir de milisegundos a días
};

const ManoObraGantt = () => {
  const data = datas.data;

  const tasks = data.map((task) => {
    const taskLevel = getTaskLevel(task, data);

    // Calcular el número de días entre el rango de fechas
    const days = calculateDays(formatDate(task.start_date), formatDate(task.end_date));

    // Establecer los colores dependiendo del nivel
    let backgroundColor = "#9C27B0"; // Color por defecto (morado)
    
    // Ajustar colores según el nivel
    if (taskLevel === 0) {
      backgroundColor = "#4CAF50"; // Verde
    } else if (taskLevel === 1) {
      backgroundColor = "#2196F3"; // Azul
    } else if (taskLevel === 2) {
      backgroundColor = "#FF9800"; // Naranja
    } else if (taskLevel === 3) {
      backgroundColor = "#FF5722"; // Rojo
    }

    return {
      start: new Date(formatDate(task.start_date)),
      end: new Date(formatDate(task.end_date)),
      name: task.text,
      id: String(task.id),
      parent: task.parent ? String(task.parent) : undefined, // Asignar parent si existe
      progress: task.progress,
      quantity: task.cantidad,
      unit: task.unidad,
      type: "task",
      days: days, // Añadir el campo de días
      styles: {
        progressColor: "#3498db", // Color por defecto, puedes ajustarlo
        progressSelectedColor: "#2980b9",
        backgroundColor: backgroundColor, // Aplicar el color de fondo basado en el nivel
        color: "white" // Color del texto en blanco
      }
    };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "300px", // Establecer altura máxima
        overflow: "auto" // Habilitar scroll si se excede el límite
      }}
    >
      <Gantt tasks={tasks} />
    </div>
  );
};

export default ManoObraGantt;
