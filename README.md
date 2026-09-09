# ProyectoMetodología
    # Integrantes:
        # Franco Wilberger (GIT: FrancoWilberger)
        # Thiago Tapuerca (GIT: ThiagoTapuerca)
        # Juan Braun (GIT: JuanBraun)
        # Santiago Vidal (GIT: sanmanuvidal-goat)

# SISTEMA DE SOFTWARE SOBRE MANEJO DE INVENTARIO DE FERRETERÍA 

# Taller I

    # Alcance del software: Sistema de software enfocado en la logística interna, trazabilidad y control de stock de depósito para ferreterías, optimizando tiempos de búsqueda y alertando sobre niveles críticos de mercadería.
    
    # Gestión de inventario:
        # Control de stock: Mantiene la trazabilidad exacta de insumos en tiempo real para evitar discrepancias físicas.
        # Organización de artículos: Clasifica herramientas, tornillos y accesorios reduciendo tiempos de búsqueda en depósito.
    # Automatización y CRUD:
        # Alertas automatizadas: Notifica el riesgo de agotamiento (punto de reorden) o el exceso de mercancía sobrealmacenada.
        # Gestión CRUD: Alta, baja y modificación de artículos para mantener actualizado el catálogo de datos.
    
    # Limites del sistema:
        # Sistema de venta: Acota el software exclusivamente a la logística interna de depósito, omitiendo el procesamiento de transacciones comerciales o cobros.
        # Emisión de facturas o tickets: Prescinde de integraciones fiscales o impresoras térmicas, simplificando la arquitectura técnica.
        # Contabilidad y pagos:  Desvincula la gestión de stock de los libros diarios, balances o cuentas por pagar a proveedores (funciones propias de un ERP).
    
    # Justificación de uso de ramas:Trabajamos en ramas secundarias permite desarrollar y probar cambios de forma aislada sin romper el código funcional del resto del equipo, asegurando que a `main` solo ingresen funcionalidades revisadas mediante Pull Requests.

    # El archivo `.gitignore` se diseñó para evitar subir archivos innecesarios o sensibles al repositorio público.

    # Manejo de funciones con GIT:
        # repositorio: Espacio donde se almacena el código fuente junto con todo el historial de cambios del proyecto
        # commit: Fotografía o registro puntual en el tiempo que guarda modificaciones específicas con un mensaje explicativo.
        # ramas: Líneas de desarrollo independientes que permiten crear nuevas funciones sin alterar el código principal.
    
    # Gestión de dependencias:
        # Gestores de paquetes: Evitan la necesidad de "reinventar la rueda", permitiendo integrar librerías probadas para tareas complejas (bases de datos, UI, validaciones). Aseguran la consistencia del entorno entre todos los desarrolladores del equipo mediante un archivo de manifiesto estandarizado.

    # LENGUAGE/ENTORNO      GESTOR DE PAQUETES      ARCHIVO DE CONFIGURACIÓN            USO PRINCIPAL
    Node.js/JavaScript      npm/yarn                package.json                        Librerias web, frameworks UI y utilidades backend

    Python                  pip/poetry              requirements.txt                    Scripts, tratamientos de datos y microservicios

    Java                    maven/gradle           pom.xml/build.gradle                 Estructura y dependencias de nivel empresarial

    C#/.NET                 NuGet                   .csproj                             Paquetes y componentes del ecosistema .NET

