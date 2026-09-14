# ProyectoMetodología
    # Integrantes:
        # Franco Wilberger (GIT: FrancoWilberger; Legajo: 22397)
        # Thiago Tapuerca (GIT: ThiagoTapuerca; Legajo: 23071)
        # Juan Braun (GIT: JuanBraun, Legajo: 22456)
        # Santiago Vidal (GIT: sanmanuvidal-goat; Legajo: 22762)

# SISTEMA DE SOFTWARE SOBRE MANEJO DE INVENTARIO

### Taller I

    # Alcance del software: Sistema de software enfocado en la logística interna, trazabilidad y control de stock de depósito, optimizando tiempos de búsqueda y alertando sobre niveles críticos de mercadería.
    
## Problema que resuelve
    El sistema resuelve las discrepancias de stock físico y los tiempos excesivos de búsqueda en depósito mediante:
* **Trazabilidad en tiempo real:** Control exhaustivo de entradas, salidas y existencias de insumos y herramientas.
* **Organización y categorización:** Clasificación ordenada de artículos (herramientas, tornillería, accesorios).
* **Alertas automáticas:** Notificación de punto de reorden (riesgo de quiebre de stock) y control de sobrealmacenamiento.
* **Gestión CRUD:** Mantenimiento ágil y estructurado del catálogo de artículos.
    
## Límites del sistema (Fuera de alcance)
* **Punto de venta y cobros:** Se acota estrictamente a la gestión de inventario interna; no procesa pagos ni transacciones comerciales.
* **Facturación fiscal:** No integra impresoras térmicas ni emisión de comprobantes fiscales.
* **Módulo contable:** Desvinculado de libros diarios y balances financieros (funciones propias de un ERP general).

##  Stack Tecnológico
* **Runtime / Lenguaje:** [Ej: Node.js v20.x / Python 3.11.x]
* **Gestor de Dependencias:** [Ej: npm / pip]
* **Base de Datos:** [Ej: PostgreSQL 16 / SQLite]
* **Control de Versiones:** Git & GitHub

## Instalación y Reproducibilidad

Seguir estos pasos para clonar y ejecutar el entorno localmente desde cero:

## 1. Clonar el repositorio
```bash
git clone https://github.com/JuanBraun/ProyectoMetodo.git

2. Reconstruir el entorno y dependencias
    Instalar dependencias:
        Bash
        npm install
    Configurar variables de entorno:
        Bash
        cp .env.example .env

3. Ejecutar la aplicación
    Bash
    npm start

    # Justificación de uso de ramas:Trabajamos en ramas secundarias permite desarrollar y probar cambios de forma aislada sin romper el código funcional del resto del equipo, asegurando que a `main` solo ingresen funcionalidades revisadas mediante Pull Requests.

    # El archivo `.gitignore` se diseñó para evitar subir archivos innecesarios o sensibles al repositorio público
