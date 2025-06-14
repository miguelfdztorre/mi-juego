class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.rocas = [];

        this.puntuacion = 0;

        // <<< OBTENEMOS EL ELEMENTO DE AUDIO DE LA MONEDA
        this.sonidoMoneda = document.getElementById("sonidoMoneda");

        this.crearEscenario();
        this.agregarEventos();
        this.puntosElement = document.getElementById("puntos");
        /* temporizador*/
        this.tiempoRestante = 60;
        this.tiempoElement = document.getElementById("tiempo");
        this.juegoTerminado = false;
        this.iniciarTemporizador();

        /*musica*/
        this.musicaFondo = document.getElementById("musica-fondo");
        this.musicaIniciada = false; // Una bandera para controlar la música

        

    }
    crearEscenario(){
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        for (let i = 0; i < 20; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);

        }
        const posicionesRocas = [
         { x: 300, y: 300 },
        { x: 600, y: 100 },
        { x: 800, y: 350 },
       ];

        posicionesRocas.forEach(pos => {
        const roca = new Roca(pos.x, pos.y);
        this.rocas.push(roca);
        this.container.appendChild(roca.element);
      });


    }
    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.checkColisiones();
        this.moverMonedas();
    }

    
    checkColisiones() {
        setInterval(() => {
            if (!this.juegoTerminado) {
                this.monedas.forEach((moneda, index) => {
                    if (this.personaje.colisionaCon(moneda)) {
                      // <<< REPRODUCIMOS EL SONIDO DE LA MONEDA
                        this.reproducirSonidoMoneda();
                        this.container.removeChild(moneda.element);
                        this.monedas.splice(index, 1);
                        this.actualizarPuntuacion(10);

                    }
                });
            }
          this.rocas.forEach(roca => {
          if (this.personaje.colisionaCon(roca)) {
          this.perderJuego();
  }
});

        }, 100);
    }
      // <<< NUEVA FUNCIÓN PARA REPRODUCIR EL SONIDO
    reproducirSonidoMoneda() {
        // Ponemos el tiempo del audio a 0 para que pueda sonar muchas veces seguidas
        this.sonidoMoneda.currentTime = 0; 
        this.sonidoMoneda.play();
    }
    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
        
        // Verificar si se alcanzan los 100 puntos para ganar
        if (this.puntuacion >= 100 && !this.juegoTerminado) {
            this.ganarJuego();
        }
    }
    
    /*mover monedas flotantes*/
    moverMonedas() {
        setInterval(() => {
            if (!this.juegoTerminado) {
                this.monedas.forEach(moneda => {
                    moneda.mover();
                });
            }
        }, 50);
    }
    
    /*función para ganar el juego*/
    ganarJuego() {
        this.juegoTerminado = true;
        clearInterval(this.temporizador);
        alert("¡Felicidades! ¡Has ganado el juego con 100 puntos!");
    }
    
    /*temporizador*/
    iniciarTemporizador() {
        this.temporizador = setInterval(() => {
            if (this.tiempoRestante > 0 && !this.juegoTerminado) {
                this.tiempoRestante--;
                this.tiempoElement.textContent = `Tiempo: ${this.tiempoRestante}`;
            } else if (this.tiempoRestante <= 0 && !this.juegoTerminado) {
                clearInterval(this.temporizador);
                this.terminarJuego();
            }
        }, 1000);
    }
    
    /*terminar juego*/
    terminarJuego() {
        this.juegoTerminado = true;
        alert("¡Tiempo agotado!");
    }
    /*perder juego*/
    perderJuego() {
    this.juegoTerminado = true;
    clearInterval(this.temporizador);
    alert("¡Has perdido! Chocaste con una roca.");
}


}

    

class Personaje{
    constructor() {
        this.x = 50;
        this.y = 460;
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();

    }
    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
        }else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
        }else if (evento.key === "ArrowUp") {
            this.saltar();
        }
        this.actualizarPosicion();
        }


    
     saltar() {
    this.saltando = true;
    let alturaMaxima = this.y - 450;

    const salto = setInterval(() => {
      if (this.y > alturaMaxima) {
        this.y -= 20;
      } else {
        clearInterval(salto);
        this.caer();
      }
      this.actualizarPosicion();
    }, 20);
  }
    caer() {
    const gravedad = setInterval(() => {
      if (this.y < 450) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        this.saltando = false;
      }
      this.actualizarPosicion();
    }, 20);
  }
     actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
    colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

class Moneda {
  constructor() {
    this.x = Math.random() * 1100 + 50; // 50 a 1150 (con 1200px de ancho)
    this.y = Math.random() * 500 + 50;  // 50 a 550 (con 600px de alto)
    // this.x = Math.random() * 700 + 50;
    // this.y = Math.random() * 250 + 50;
    this.width = 30;
    this.height = 30;
    this.element = document.createElement("div");
    this.element.classList.add("moneda");
    
    // Propiedades para el movimiento flotante
    this.velocidadY = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1); // Velocidad entre -3 y 3
    this.yOriginal = this.y;
    this.rangoMovimiento = 30 + Math.random() * 40; // Rango de movimiento entre 30 y 70 pixels

    this.actualizarPosicion();
  }
  
  mover() {
    // Movimiento flotante vertical
    this.y += this.velocidadY;
    
    // Cambiar dirección si se sale del rango permitido
    if (this.y > this.yOriginal + this.rangoMovimiento || this.y < this.yOriginal - this.rangoMovimiento) {
      this.velocidadY *= -1;
    }
    
    // Mantener dentro de los límites del juego
    if (this.y < 30) {
      this.y = 30;
      this.velocidadY = Math.abs(this.velocidadY);
    }
    if (this.y > 570) {
      this.y = 570;
      this.velocidadY = -Math.abs(this.velocidadY);
    }
    
    this.actualizarPosicion();
  }
  
  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

}
class Roca {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.element = document.createElement("div");
    this.element.classList.add("roca");
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}
document.getElementById("botonMusica").addEventListener("click", () => {
    const audio = document.getElementById("musica");
    audio.play().catch(error => {
      console.log("Error al reproducir audio:", error);
    });
  });

  

const juego = new Game();