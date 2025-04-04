// Construccion.js
import axios from 'axios';

// URL base de la API
const API_URL = 'https://automatizacionapo-backend.onrender.com/api/Construccion';

// Variable global para almacenar el idProyecto
let idusuario;
const Obtenermessage=() => { 
const message = sessionStorage.getItem('message');
if(message){
  idusuario = message;
    }else{
       throw new Error('No se encontró el idProyecto en el localStorage');
    }
};

export const CrearProyecto = async (DatosProyecto) => {
  try{
    const response = await axios.post(`${API_URL}/CrearProyecto`, DatosProyecto, {
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

export const editarActividades = async (actividades, id_proyecto) => {
  try {
    
    // Estructura del cuerpo de la solicitud
    const requestBody = {
      idProyecto: id_proyecto,
      actividades: actividades,
    };
    console.log(requestBody);
    // Realizar la petición POST usando axios
    const response = await axios.post(`${API_URL}/EditarActividades`, requestBody, {
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
    console.log(requestBody);
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

export const editarEmpleados = async (empleados, id_proyecto) => {
  try{
    const requestBody = {
      idProyecto: id_proyecto,
      groups: empleados.groups,
      items: empleados.items,
    };
    console.log(requestBody);
    const response = await axios.post(`${API_URL}/EditarEmpleados`, requestBody,{
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

export const agregarMaterial = async (id_proyecto, material) => {
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
 
export const ObtenerFamilias = async () => {
  try{
    const response = await axios.post(`${API_URL}/ObtenerFamilias`,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener familias:', error);
    throw error;
  }
}

export const ObtenerSubfamiliasPorFamilia = async (id_familia) => {
  try{
    const requestBody = {
      id: id_familia
    }
    const response = await axios.post(`${API_URL}/ObtenerSubfamiliasPorFamilia`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener subfamilias:', error);
    throw error;
  }
}

export const ObtenerCategoriasPorSubfamilia = async (id_subfamilia) => {
  try{
    const requestBody = {
      id: id_subfamilia
    }
    const response = await axios.post(`${API_URL}/ObtenerCategoriasPorSubfamilia`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener categorias:', error);
    throw error;
  }
}

export const ObtenerNumeroMateriales = async (request) => {
  try{
    
    const requestBody = {
      categoria_id: request.categoria_id,
      busqueda: request.busqueda,
      numeroPagina: 0,
      numeroRegistros: 0,
    }
    const response = await axios.post(`${API_URL}/ObtenerNumeroMateriales`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener numero materiales:', error);
    throw error;
  }
}

export const ObtenerMaterialesPaginados = async (search) => {
  try{
    const requestBody = {
      categoria_id: search.categoria_id,
      busqueda: search.busqueda,
      numeroPagina: search.numeroPagina,
      numeroRegistros: search.numeroRegistros,
    }
    const response = await axios.post(`${API_URL}/ObtenerMaterialesPaginados`, requestBody,{
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener numero materiales:', error);
    throw error;
  }
}

export const ObtenerMaterialesPorId = async (materiales) => {
  try{
    const response = await axios.post(`${API_URL}/ObtenerMaterialesPorId`, materiales, {
      headers:{
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }catch(error){
    console.error('Error al obtener numero materiales:', error);
    throw error;
  }
}

