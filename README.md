# TZOOTZ RESEARCH TERMINAL

**Terminal web minimalista** para acceder a contenidos vanguardistas de TZOOTZ RESEARCH (música, apps, cine) desde móvil (9:16) con estética de mainframe retro.

## 🌟 Características
- **3 Secciones interactivas**:
  - **TZOOTZ TV**: Carrusel automático de videos (sin UI).
  - **MUSIC DATABASE**: Listado de temas reproducibles al tocar.
  - **DEVELOPMENT CONSOLE**: Links directos a proyectos externos.
- **Diseño terminal**:
  - Verde fosforescente sobre fondo negro.
  - Fuente monoespaciada (`Courier New`).
  - Bordes estilo TUI (Text User Interface).
- **100% responsive** para móviles verticales.

🚀 Cómo desplegar
Hosting estático (recomendado):

bash
# Con Surge.sh (gratis)
surge ./tzootz-terminal
O usa Netlify/Vercel arrastrando la carpeta.

Personalización:

Edita index.html para actualizar:

Nombres de archivos en videoFiles y songs.

Links en devLinks.

Cambia colores en el CSS (busca #0f0 para modificar el verde).

💡 Comandos útiles (para futuras mejoras)
javascript
// Añadir más videos/audios
const videoFiles = ["nuevo.mp4", ...];
const songs = [{ title: "NUEVO_TEMA", file: "music/nuevo.mp3" }];

// Cambiar estilo a azul cian
body { color: #00ffff; }
📌 Requisitos
Servidor web básico (funciona hasta en GitHub Pages).

Videos/audios en formatos compatibles con HTML5 (mp4, webm, mp3).

🎨 Inspiración
Terminales UNIX años 80.

Interfaces de sistemas como VMS o MS-DOS.

Estética cyberpunk/low-tech.

© 2024 TZOOTZ RESEARCH | Vig0 + M4DR1D
--->
