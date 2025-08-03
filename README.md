# Sistema de Punto de Venta Ventry - Frontend

Hola, este es el frontend de un sistema de punto de venta desarrollado con React, TypeScript y Electron. El objetivo es proporcionar una solución completa para la gestión de ventas e inventario, con una interfaz moderna y fácil de usar.  
La licencia de este proyecto te permite usarlo de forma gratuita, ya sea para fines personales o educativos. Sin embargo, si deseas utilizarlo con fines comerciales, se requiere una licencia comercial. Para más detalles, contáctame personalmente [manuelvgc2233@gmail.com](mailto:manuelvgc2233@gmail.com). Si deseas más información, consulta el archivo LICENSE del repositorio.

### Índice
[Instalación](#instalación)  
[Requisitos](#requisitos)  
[Características](#características)  
[Estructura del Proyecto](#estructura-del-proyecto)  
[Configuración de Electron](#configuración-de-electron)  
[Uso de TailwindCSS](#uso-de-tailwindcss)  
[Gestión de Estado](#gestión-de-estado)  
[Licencia](#licencia)

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/VictorMGCYT/POS-frontend.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd POS-frontend
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Inicia la aplicación en modo desarrollo:
    ```bash
    npm run dev
    ```

5. Para empaquetar la aplicación:
    ```bash
    npm run build
    ```

## Requisitos

El proyecto se ha desarrollado utilizando las siguientes versiones de Node.js y herramientas. Asegúrate de tenerlas instaladas para evitar problemas de compatibilidad:
- **Node.js**: v22.13.1
- **npm**: v9.6.7

## Características

- **Interfaz moderna**: Desarrollada con React y TailwindCSS para una experiencia de usuario fluida y atractiva.
- **Gestión de estado**: Utiliza Zustand para un manejo eficiente del estado global.
- **Integración con backend**: Comunicación con el backend desarrollado en NestJS mediante Axios.
- **Soporte multiplataforma**: Empaquetado con Electron para funcionar en Windows, macOS y Linux.
- **Componentes reutilizables**: Implementación de componentes UI con Radix UI.
- **Generación de código QR**: Uso de la librería `qrcode.react` para generar códigos QR dinámicos.
- **Temas dinámicos**: Soporte para temas claros y oscuros con `tawilwindcss y Shadcn`.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

- **src/**: Contiene el código fuente principal.
  - **components/**: Componentes reutilizables de la interfaz.
  - **hooks/**: Custom hooks para lógica específica (ej. `useSales`, `useTheme`).
  - **routes/**: Definición de las rutas de la aplicación.
  - **lib/**: Funciones utilitarias.
  - **assets/**: Archivos estáticos como imágenes y logos.
- **electron/**: Configuración de Electron y el backend integrado.
  - **main.cjs**: Archivo principal de Electron.
  - **backend/**: Contiene el backend empaquetado junto con `node.exe`.

## Configuración de Electron

El archivo `main.cjs` configura la ventana principal de la aplicación y ejecuta el backend en producción. En desarrollo, utiliza el entorno global de Node.js.  
En producción, el backend y `node.exe` se desempaquetan en `resources/app.asar.unpacked`.

## Uso de TailwindCSS

El proyecto utiliza TailwindCSS para estilos rápidos y consistentes. La configuración está en el archivo `tailwind.config.js`.  
Para extender los estilos, puedes modificar las clases en los componentes o agregar configuraciones personalizadas.

## Gestión de Estado

Se utiliza Zustand para manejar el estado global de la aplicación. Esto permite una gestión eficiente y reactiva de los datos del usuario.

## Licencia

Este proyecto está bajo una licencia gratuita para uso personal y educativo. Para uso comercial, contáctame en [manuelvgc2233@gmail.com](mailto:manuelvgc2233@gmail.com).