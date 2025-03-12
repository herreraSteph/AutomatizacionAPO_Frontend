// Construccion.js
import axios from 'axios';

// URL base de la API
const API_URL = 'https://automatizacionapo-backend.onrender.com/api/PreciosUnitarios';

// Variable global para almacenar el idProyecto
let idProyecto;
let idusuario;
// Función para obtener el idProyecto del localStorage
const obtenerIdProyecto = () => {
  const message = localStorage.getItem('idProyecto');
  if (message) {
    idProyecto = message; // Asumimos que el idProyecto está en el objeto message
  } else {
    throw new Error('No se encontró el idProyecto en el localStorage');
  }
};
const Obtenermessage=() => { 
const message = localStorage.getItem('message');
if(message){
  idusuario = message;
    }else{
       throw new Error('No se encontró el idProyecto en el localStorage');
    }
};
export const ObtenerNumeros = async () => {
  try{
    Obtenermessage();
    const requestBody = {
      id_usuario: idusuario,
    };
    const response = await axios.post(`${API_URL}/ObtenerDescargaCPC`, requestBody,{
    headers:{
      'Content-Type': 'application/json',
    },
  });
    return response.data;
  }catch(error){
    console.error('Error al obtener descargaCPC:', error);
    throw error;
  }
}