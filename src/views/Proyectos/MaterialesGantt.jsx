import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import ManoObraGantt from "./Gantt-Charts/ManoObraGantt";
import MainCard from "ui-component/cards/MainCard";
import Equipo from "./Gantt-Charts/CronogramaEquipo";
import { Button, CircularProgress} from "@mui/material"; // Importa el componente Button de Material-UI
import { agregarEquipo } from "../../api/Construccion";

const MaterialesGantt = () => {
  const cronogramaRef = useRef(null);
  const [showGantt, setShowGantt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Obtén la función navigate para la navegación

  const toggleGantt = () => {
    setShowGantt(!showGantt);
  };

  const guardarDatos = async () => {
      if (cronogramaRef.current) {
        setIsLoading(true);
        try{
          const datos = cronogramaRef.current.exportData();
          const response = await agregarEquipo(datos);
          if(response.tipoError === 0){
            navigate("/proyectos/DescripcionMaterial");
          }else{
            console.error("Error al enviar los datos:", response.mensaje);
          }
        }catch(error){
          console.error('Error al agregar empleados:', error);
        }finally{  
          setIsLoading(false);
        }
    };
  };

  return (
    <MainCard title="EQUIPO, MAQUINARIA, HERRAMIENTA Y MATERIALES">
      {/* Botón para mostrar/ocultar ManoObraGantt */}
      <Button variant="contained" color="primary" onClick={toggleGantt} style={{ marginRight: '10px' }}>
        {showGantt ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </Button>

      {/* Botón para redireccionar a /proyectos/descripcionmaterial */}
      <Button variant="contained" 
              color="primary" 
              onClick={guardarDatos}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}>
        Siguiente
      </Button>

      {/* Renderiza ManoObraGantt solo si showGantt es true */}
      {showGantt && <ManoObraGantt />}

      <br />

      {/* Equipo se muestra siempre */}
      <Equipo ref={cronogramaRef}/>
    </MainCard>
  );
};

export default MaterialesGantt;