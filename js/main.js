const botonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const vistaMovil = window.matchMedia("(max-width: 760px)");

function cambiarMenu(abierto) {
  botonMenu.setAttribute("aria-expanded", String(abierto));
  botonMenu.textContent = abierto ? "Cerrar" : "Menú";
  menu.hidden = !abierto;
}

function adaptarMenu() {
  botonMenu.hidden = !vistaMovil.matches;
  cambiarMenu(!vistaMovil.matches);
}

botonMenu.addEventListener("click", () => {
  const abierto = botonMenu.getAttribute("aria-expanded") === "true";
  cambiarMenu(!abierto);
});

menu.addEventListener("click", (evento) => {
  const enlace = evento.target.closest("a");

  if (!enlace || !vistaMovil.matches) return;

  cambiarMenu(false);

  const destino = document.querySelector(enlace.getAttribute("href"));

  if (destino) {
    destino.setAttribute("tabindex", "-1");
    destino.focus({ preventScroll: true });

    destino.addEventListener("blur", () => {
      destino.removeAttribute("tabindex");
    }, { once: true });
  }
});

document.addEventListener("keydown", (evento) => {
  const abierto = botonMenu.getAttribute("aria-expanded") === "true";

  if (evento.key === "Escape" && vistaMovil.matches && abierto) {
    cambiarMenu(false);
    botonMenu.focus();
  }
});

vistaMovil.addEventListener("change", adaptarMenu);
adaptarMenu();

document.querySelector("#anio").textContent = new Date().getFullYear();

// MOSTRAR Y OCULTAR EL ENCABEZADO SEGÚN EL DESPLAZAMIENTO

const encabezado = document.querySelector(".encabezado");

let scrollAnterior = Math.max(0, window.scrollY);
let desplazamientoAcumulado = 0;

function mostrarEncabezado() {
  encabezado.classList.remove("encabezado-oculto");
  desplazamientoAcumulado = 0;
}

window.addEventListener("scroll", () => {
  const scrollActual = Math.max(0, window.scrollY);
  const diferencia = scrollActual - scrollAnterior;

  scrollAnterior = scrollActual;

  const menuMovilAbierto =
    vistaMovil.matches &&
    botonMenu.getAttribute("aria-expanded") === "true";

  const focoEnEncabezado =
    encabezado.contains(document.activeElement);

  if (
    scrollActual <= encabezado.offsetHeight ||
    menuMovilAbierto ||
    focoEnEncabezado
  ) {
    mostrarEncabezado();
    return;
  }

  if (diferencia === 0) return;

  if (
    Math.sign(diferencia) !==
    Math.sign(desplazamientoAcumulado)
  ) {
    desplazamientoAcumulado = 0;
  }

  desplazamientoAcumulado += diferencia;

  if (desplazamientoAcumulado > 24) {
    encabezado.classList.add("encabezado-oculto");
    desplazamientoAcumulado = 0;
  } else if (desplazamientoAcumulado < -12) {
    mostrarEncabezado();
  }
}, { passive: true });

encabezado.addEventListener("focusin", mostrarEncabezado);
botonMenu.addEventListener("click", mostrarEncabezado);

window.addEventListener("resize", () => {
  scrollAnterior = Math.max(0, window.scrollY);
  mostrarEncabezado();
});