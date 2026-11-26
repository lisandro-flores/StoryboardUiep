# StoryboardUiep

**Diagnóstico Comunitario Participativo — San José Buenavista, Puebla**  
*Universidad Intercultural del Estado de Puebla (UIEP) · Ingeniería Civil Sustentable – Vinculación Comunitaria*

Aplicación web editorial e interactiva construida con **Astro + React + Tailwind CSS v4 + Motion + Embla Carousel + Lenis**, diseñada para consultarse desde cualquier teléfono móvil al escanear el código QR de la lona comunitaria en **San José Buenavista, Puebla**.

## Stack y librerías modernas

- **Astro + Islas de React 19:** Carga inicial estática ultraligera pensada para redes móviles rurales, hidratando solo la experiencia interactiva.
- **Motion (`motion/react`):** Hilo de progreso superior con física `spring`, píldoras de navegación compartidas (`layoutId`), revelados editoriales `whileInView`, visor de láminas con `AnimatePresence` y barras cinéticas de voz.
- **Embla Carousel (`embla-carousel-react`):** Modo **Carrusel Táctil** para deslizar las 8 láminas con física nativa en dispositivos móviles.
- **Lenis:** Desplazamiento inercial suave respetando `prefers-reduced-motion`.
- **Cero iconos ni emojis:** Jerarquía 100 % editorial mediante tipografías `Fraunces` (serif variable orgánica), `Plus Jakarta Sans` y numerales `JetBrains Mono` (`01` — `08`), armonizada con la paleta cálida de la lona (`#FAF3E8`, `#1F4A23`, `#7D9154`, `#F1C28B`, `#EAB6BA`, `#8E6545`).

## Desarrollo local

```bash
npm install
npm run dev
```

Compilación de producción:

```bash
npm run build
npm run preview
```

## Despliegue automático en GitHub Pages

El repositorio incluye [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). En GitHub ve a **Settings → Pages → Build and deployment → Source: GitHub Actions** y cada `git push` a `main` publicará automáticamente el sitio en `https://lisandro-flores.github.io/StoryboardUiep/`.
