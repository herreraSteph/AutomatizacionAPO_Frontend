// Construccion.js
import axios from 'axios';

// URL base de la API
const API_URL = 'https://automatizacionapo-backend.onrender.com/api/Construccion';

// Variable global para almacenar el idProyecto
let idProyecto;

// Función para obtener el idProyecto del localStorage
const obtenerIdProyecto = () => {
  const message = localStorage.getItem('idProyecto');
  if (message) {
    idProyecto = message; // Asumimos que el idProyecto está en el objeto message
  } else {
    throw new Error('No se encontró el idProyecto en el localStorage');
  }
};

// Método POST para agregar actividades
export const agregarActividades = async (actividades) => {
  try {
    // Obtener el idProyecto del localStorage
    obtenerIdProyecto();
    
    // Estructura del cuerpo de la solicitud
    const requestBody = {
      idProyecto: idProyecto,
      actividades: actividades,
    };

    // Realizar la petición POST usando axios
    const response = await axios.post(`${API_URL}/AgregarActividades`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Retornar la respuesta de la API
    return response.data;
  } catch (error) {
    // Manejar errores
    console.error('Error al agregar actividades:', error);
    throw error;
  }
};

export const obtenerActividades = async () =>{
  try{

    obtenerIdProyecto();

    const requestBody = {
      id: idProyecto
    }

    const response = await axios.post(`${API_URL}/ObtenerActividades`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener actividades:', error);
    throw error;
  }
};

export const agregarEmpleados = async (empleados) => {
  try{
    obtenerIdProyecto();
    const requestBody = {
      idProyecto: idProyecto,
      groups: empleados,
    };
    const response = await axios.post(`${API_URL}/AgregarEmpleados`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;

  }catch(error){
    console.error('Error al agregar empleados:', error);
    throw error;
  }
}

export const agregarEquipo = async (equipo) => {
  try{
    obtenerIdProyecto();
    const requestBody = {
      idProyecto: idProyecto,
      groups: equipo,
    };
    const response = await axios.post(`${API_URL}/AgregarEquipo`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;

  }catch(error){
    console.error('Error al agregar empleados:', error);
    throw error;
  }
}

export const agregarMaterial = async (material) => {
  try{
    obtenerIdProyecto();
    const requestBody = {
      idProyecto: idProyecto,
      materiales: material,
    };
    const response = await axios.post(`${API_URL}/AgregarMaterial`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;

  }catch(error){
    console.error('Error al agregar empleados:', error);
    throw error;
  }
}
