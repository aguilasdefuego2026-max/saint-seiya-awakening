# Convertir el juego web en APK Android

Este proyecto es una aplicación React/Vite. Se preparó para empaquetarse como aplicación Android mediante Capacitor. El entorno donde se preparó el archivo no incluye Android SDK ni Gradle, por lo que no es posible compilar y verificar aquí un APK instalable. El flujo de GitHub Actions incluido compila el APK automáticamente en un entorno Android.

## Obtener el APK
1. Sube el contenido de este ZIP a un repositorio de GitHub (por ejemplo, `saint-seiya-awakening`).
2. Abre el repositorio y entra en **Actions**.
3. Selecciona **Build Android APK** y pulsa **Run workflow** (o haz un `push` a `main`/`master`).
4. Cuando termine correctamente, abre la ejecución y descarga el artefacto **saint-seiya-awakening-debug-apk**.
5. Dentro del ZIP descargado estará `app-debug.apk`. Transfiérelo a Android y permite la instalación desde esa fuente si el teléfono lo solicita.

El APK generado es de depuración (debug), útil para instalar y probar. Para publicar en Google Play se debe generar y proteger una firma de lanzamiento (release).

## Identidad de la aplicación
- Nombre: Saint Seiya Awakening
- ID Android: `com.game.saintseiya`

## Consideraciones
- La compilación requiere conexión a internet en GitHub Actions para descargar dependencias.
- Las fuentes web configuradas en `index.html` requieren conexión para cargarse; si se desea funcionamiento totalmente sin internet, conviene incluir las fuentes dentro del proyecto.
- Este empaquetado conserva el juego existente; no convierte automáticamente una demo web en un juego nativo ni agrega funciones que no existan en el código original.
