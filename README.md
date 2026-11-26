# StoryboardUiep

**Diagnóstico Comunitario Participativo — San José Buenavista, Puebla**  
*Universidad Intercultural del Estado de Puebla (UIEP) · Ingeniería Civil Sustentable – Vinculación Comunitaria*

Experiencia digital inmersiva y storyboard ilustrado en 8 láminas para las familias, jóvenes, adultos mayores, comités y autoridades de **San José Buenavista, Puebla**, diseñada para abrirse desde el código QR de la lona informativa comunitaria (90 × 120 cm).

## Arquitectura de Experiencia Inmersiva y UX/UI

- **GSAP + ScrollTrigger (`gsap`, `@gsap/react`):** Coreografías de entrada con máscaras tipográficas en el Hero, parallax interno continuo sobre las acuarelas y espina topográfica que se dibuja dinámicamente al avanzar en la lectura.
- **Lenis sincronizado al ticker de GSAP:** Desplazamiento inercial a 60/120 fps respetando `prefers-reduced-motion`.
- **Motion (`motion/react`):**
  - Píldoras adaptativas con física de resorte (`layoutId`).
  - Láminas interactivas 3D (`TiltPlate`) con inclinación suave y reflejo cálido de luz solar.
  - **Modo Documental Guiado:** Reproductor tipo *story* con movimiento de cámara *Ken Burns*, barras de progreso por capítulo (`01` — `08`) y subtítulos editoriales sincronizados.
- **Inspector de Alta Definición (`react-zoom-pan-pinch`):** Pellizcar para acercar (*pinch-to-zoom*), arrastrar y explorar cada detalle de las acuarelas (rampas, puente peatonal y mapa social) hasta `3.5x`.
- **Carrusel Táctil (`embla-carousel-react`):** Deslizamiento horizontal con física nativa para teléfonos móviles.
- **Cartografía Participativa Interactiva (`TerritoryMapExplorer`):** Esquema territorial con 5 nodos activos que conectan cada necesidad vecinal con la propuesta técnica sustentable de la UIEP.
- **Audio Generativo Web Audio API + Voz (`es-MX`):** Síntesis de atmósfera de valle y notas armónicas pentatónicas de 0 KB (sin archivos pesados externos), junto con lectura en voz alta e indicador cinético `AudioWave`.
- **UX Inclusiva y Compromiso Vecinal (`canvas-confetti` + `localStorage`):** Selector de **Lectura amplia** (`+12.5%` tipográfico) pensado para personas adultas mayores, y tarjetas interactivas para registrar compromiso en los 3 pasos comunitarios.
- **Cero iconos genéricos ni emojis:** Sistema visual 100 % tipográfico y cartográfico (`Fraunces`, `Plus Jakarta Sans`, `JetBrains Mono`).

## Comandos

```bash
npm install
npm run dev      # Entorno de desarrollo local
npm run build    # Compilación estática optimizada en dist/
npm run preview  # Vista previa de producción
```
