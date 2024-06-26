// Seleccionar elementos del DOM
const formularioElement = document.querySelector('#formulario');
const resultadoElement = document.querySelector('#resultado');
const ciudadInputElement = document.querySelector('#ciudad');
const paisInputElement = document.querySelector('#pais');
const containerElement = document.querySelector('.container');


// Funcion que inicializa la busqueda
const init = (vent) => {
  vent.preventDefault();

  const ciudad = ciudadInputElement.value.trim();
  const pais = paisInputElement.value.trim();

  // Validar formulario
  if (!validarFormulario(ciudad, pais)) {
    mostrarAlerta('Error!', 'Todos los campos son obligatorios', false);
    return
  };

  // Consultar API
  consultarAPI(ciudad, pais);

  // Resetear formulario
  formularioElement.reset();
};


// Validar formulario
const validarFormulario = (ciudad, pais) => [ciudad, pais].includes('') ? false : true;


// Mostrar alerta
const mostrarAlerta = (initMesage, mensaje, tipo = true) => {
  const alerta = document.querySelector('.alerta');

  if (!alerta) {
    const alertaElement = document.createElement('div');
    alertaElement.innerHTML = `<strong class="font-bold">${initMesage}</strong>  <span>${mensaje}</span>`;
    alertaElement.classList.add('px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta');

    tipo ? alertaElement.classList.add('bg-green-100', 'border-green-400', 'text-green-700') : alertaElement.classList.add('bg-red-100', 'border-red-400', 'text-red-700');

    containerElement.appendChild(alertaElement);

    setTimeout(() => {
      alertaElement.remove();
    }, 3000);
  }
};


// Consultar API
const consultarAPI = async (ciudad, pais) => {
  const APIKEY = 'bd9f8a2fab2b3fa26d17df27a6ab522e';
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${APIKEY}`;

  mostrarSpinner();

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.cod === '404') {
      limpiarHTML();
      mostrarAlerta('Error!', 'Ciudad no encontrada', false);
      return
    };

    // Mostrar el clima en el html
    mostrarClima(data);

  } catch (error) {
    console.error(error, "Error en la consulta de la API");
  }
};


// Mostrar el clima en el html
const mostrarClima = (data) => {
  limpiarHTML();

  const { name, main: { temp, temp_max, temp_min } } = data;
  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const climaElement = document.createElement('div');
  climaElement.classList.add('text-center', 'text-white');
  climaElement.innerHTML = `
    <p class="font-bold text-2xl">Clima en: ${name}</p>
    <p class="font-bold text-6xl">${centigrados} &#8451;</p>
    <p class="font-bold">Max: ${max} &#8451;</p>
    <p class="font-bold">Min: ${min} &#8451;</p>
  `;

  resultadoElement.appendChild(climaElement);
}


// Convertir de Kelvin a Centigrados
const kelvinACentigrados = (grados) => parseInt(grados - 273.15);


// Limpia el html previo
const limpiarHTML = () => {
  while (resultadoElement.firstChild) {
    resultadoElement.removeChild(resultadoElement.firstChild);
  }
}

// Muestra un spinner de carga
const mostrarSpinner = () => {
  limpiarHTML();

  const spinnerElement = document.createElement('div');
  spinnerElement.classList.add('sk-fading-circle');

  spinnerElement.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  `;

  resultadoElement.appendChild(spinnerElement);
}

// Cargar Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  formularioElement.addEventListener('submit', init);
});