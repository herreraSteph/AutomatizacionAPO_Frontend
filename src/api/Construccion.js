// Construccion.js
import axios from 'axios';

// URL base de la API
const API_URL = 'https://automatizacionapo-backend.onrender.com/api/Construccion';

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

export const crearNumero = async (DatosNumero) => {
  try{
    Obtenermessage();
    DatosNumero.id_usuario = idusuario;
    const response = await axios.post(`${API_URL}/Crear`, DatosNumero, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data;
  }catch(error){
    console.error('Error al obtener actividades:', error);
    throw error;
  }
}

// Método POST para agregar actividades
export const agregarActividades = async (actividades, id_proyecto) => {
  try {
    
    // Estructura del cuerpo de la solicitud
    const requestBody = {
      idProyecto: id_proyecto,
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

export const obtenerActividades = async (id_proyecto) =>{
  try{
    const requestBody = {
      id: id_proyecto
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

export const agregarEmpleados = async (empleados, id_proyecto) => {
  try{
    const requestBody = {
      idProyecto: id_proyecto,
      groups: empleados.groups,
      items: empleados.items,
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

export const agregarEquipo = async (equipo, id_proyecto) => {
  try{
    const requestBody = {
      idProyecto: id_proyecto,
      groups: equipo.groups,
      items: equipo.items,
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

export const agregarMaterial = async (material, id_proyecto) => {
  try{
    const requestBody = {
      idProyecto: id_proyecto,
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

export const obtenerUltimoNumero = async () => {
  try{
    const response = await axios.post(`${API_URL}/ObtenerUltimoNumero`);
    return response.data;
  }catch(error){
    console.error('Error al agregar empleados:', error);
    throw error;
  }
}

export const obtenerEmpleados = async (tipoEmpleado) => {
  try{
    const requestBody = {
      id: tipoEmpleado
    }
    const response = await axios.post(`${API_URL}/ObtenerEmpleados`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener empleados:', error);
    throw error;
  }
}

 export const  ObtenerCPC = async (Check) => {
  try{
    Obtenermessage();
    const requestBody = {
      id_usuario: idusuario,
      proyectoCheck: Check
    };
    const response = await axios.post(`${API_URL}/ObtenerCPC`, requestBody,{
    headers:{
      'Content-Type': 'application/json',
    },
  });
    return response.data;
  }catch(error){
    console.error('Error al obtener CPC:', error);
    throw error;
  }
}

export const DescargarCPC = async (id_proyecto) => {
  try {
    const requestBody = {
      id: id_proyecto,
    };
    const response = await axios.post(`${API_URL}/DescargarCPC`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: 'blob', // Para manejar datos binarios como archivos
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    });
    return response;
  } catch (error) {
    console.error("Error al obtener CPC:", error);
    throw error;
  }
};


export const VerificarProyectoExistente = async (id_numero) => {
  try {
    const requestBody = {
      idNumero: id_numero,
    };
    const response = await axios.post(`${API_URL}/VerificarProyectoExistente`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener CPC:", error);
    throw error;
  }
}

export const CheckProjectData = async (id_proyecto) => {
  try {
    const requestBody = {
      id: id_proyecto,
    };
    const response = await axios.post(`${API_URL}/CheckProjectData`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener CPC:", error);
    throw error;
  }
}

export const GetManoObraEdit = async (id_proyecto) => {
  try {
    const requestBody = {
      id: id_proyecto,
    };
    const response = await axios.post(`${API_URL}/GetManoObraEdit`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener CPC:", error);
    throw error;
  }
}
 

