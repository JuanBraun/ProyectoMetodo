# ProyectoMetodología - Sistema de Manejo de Inventario

### Taller I & II

**Integrantes:**

- Franco Wilberger (GIT: `FrancoWilberger` | Legajo: 22397)
- Thiago Tapuerca (GIT: `ThiagoTapuerca` | Legajo: 23071)
- Juan Braun (GIT: `JuanBraun` | Legajo: 22456)
- Santiago Vidal (GIT: `sanmanuvidal-goat` | Legajo: 22762)

---

## Alcance del Software

Sistema de software enfocado en la logística interna, trazabilidad y control de stock de depósito, optimizando tiempos de búsqueda y alertando sobre niveles críticos de mercadería.

## Problema que resuelve

El sistema resuelve las discrepancias de stock físico y los tiempos excesivos de búsqueda en depósito mediante:

- **Trazabilidad en tiempo real:** Control exhaustivo de entradas, salidas y existencias de insumos y herramientas.
- **Organización y categorización:** Clasificación ordenada de artículos (herramientas, tornillería, accesorios).
- **Alertas automáticas:** Notificación de punto de reorden (riesgo de quiebre de stock) y control de sobrealmacenamiento mediante patrón _Observer_.
- **Gestión CRUD:** Mantenimiento ágil y estructurado del catálogo de artículos.

## Límites del sistema (Fuera de alcance)

- **Punto de venta y cobros:** Se acota estrictamente a la gestión de inventario interna; no procesa pagos ni transacciones comerciales.
- **Facturación fiscal:** No integra impresoras térmicas ni emisión de comprobantes fiscales.
- **Módulo contable:** Desvinculado de libros diarios y balances financieros (funciones propias de un ERP general).

---

## Stack Tecnológico

- **Runtime / Lenguaje:** Node.js (v20 o superior) / JavaScript ES6+
- **Framework Web:** Express.js
- **Base de Datos:** MySQL / MariaDB (Driver: `mysql2`)
- **Gestor de Dependencias:** npm
- **Control de Versiones:** Git & GitHub

---

## Estructura de Endpoints (API REST)

- **Productos (`/api/productos`):**
  - `GET /api/productos` - Listar todos los productos
  - `GET /api/productos/:id` - Obtener detalle de un producto por ID
  - `POST /api/productos` - Registrar un nuevo producto
  - `PUT /api/productos/:id` - Actualizar un producto existente
  - `DELETE /api/productos/:id` - Eliminar un producto

- **Movimientos de Stock (`/api/movimientos`):**
  - `POST /api/movimientos` - Registrar entrada/salida de stock (`INGRESO` / `EGRESO`)
  - `GET /api/movimientos/producto/:productoId` - Obtener el historial de movimientos de un producto

- **Categorías (`/api/categorias`):**
  - `GET /api/categorias` - Listar categorías
  - `POST /api/categorias` - Crear una nueva categoría

- **Ubicaciones (`/api/ubicaciones`):**
  - `GET /api/ubicaciones` - Listar pasillos y estantes
  - `POST /api/ubicaciones` - Registrar nueva ubicación en depósito

---

## Instalación y Reproducibilidad

Seguir estos pasos para clonar y ejecutar el entorno localmente desde cero:

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanBraun/ProyectoMetodo.git
cd ProyectoMetodo
```

### 2. Configurar el entorno e instalar dependencias

```bash
npm install
cp .env.example .env
```

Configura las credenciales de conexión a MySQL en tu archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=inventario_db
```

### 3. Ejecutar la aplicación

Al iniciar el servidor, el script de inicialización creará/verificará automáticamente la base de datos `inventario_db` y sus tablas:

```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`.

---

## Decisiones de Diseño y Trabajo Colaborativo

- **Uso de Ramas (Git):** El trabajo en ramas secundarias permite desarrollar y probar cambios de forma aislada sin romper el código funcional del resto del equipo, asegurando que a `main` solo ingresen funcionalidades revisadas mediante Pull Requests.
- **Ignorado de Archivos (`.gitignore`):** El archivo `.gitignore` fue configurado para evitar subir archivos sensibles (`.env`) o carpetas pesadas (`node_modules`) al repositorio público.
- **Arquitectura:** Se aplicó separación de responsabilidades en capas (Rutas, Controladores, Servicios, Repositorios), patrón _Observer_ para desacoplar el envío de alertas de stock e inyección de dependencias para facilitar testing.
