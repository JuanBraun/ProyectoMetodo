# Documento de Análisis y Decisiones de Diseño — Taller II

**Proyecto:** Sistema de Gestión de Inventario Universal  
**Módulo analizado:** Lógica de negocio de productos y control de stock crítico.

---

## 1. Código Analizado (Ubicación)
El análisis se centró en el flujo completo de la aplicación, abarcando las siguientes capas y módulos clave:
* **Capa de Controladores:** `src/controllers/productoController.js` (gestión de las peticiones HTTP).
* **Capa de Servicios y Negocio:** `src/services/productoService.js` (orquestación de la lógica transaccional).
* **Validación de Reglas:** `src/services/stockValidator.js` (validación estricta de umbrales de stock).
* **Patrón de Comportamiento:** `src/services/observers/stockAlertObserver.js` (emisión desacoplada de alertas de stock crítico).
* **Capa de Datos/Persistencia:** `src/repositorios/repositorios.js` (abstracción del almacenamiento).

---

## 2. Diagnóstico
* **Situación detectada:** Al registrar o actualizar un producto en el inventario universal, el sistema necesita verificar de forma inmediata si el stock actual se encuentra por debajo del stock mínimo establecido para alertar sobre un posible quiebre de stock.
* **Conceptos aplicados:** 
  * **Acoplamiento vs. Desacoplamiento:** Un diseño naive habría mezclado la lógica de negocio del producto con la lógica de impresión de alertas o notificaciones en un mismo bloque de código (`if/else` gigante dentro del servicio).
  * **Clean Code y SRP (Single Responsibility Principle):** Cada módulo debe tener una única razón para cambiar. La lógica de persistencia de un producto no debe encargarse de decidir cómo o dónde se notifica una alerta crítica.

---

## 3. Alternativas Consideradas
Se evaluaron tres opciones de diseño para resolver la emisión de alertas de stock:

1. **Alternativa A (Código monolítico directo):** Incluir un condicional directo dentro del método `crearProducto` en el servicio que ejecute un `console.warn` o dispare una advertencia si el stock es bajo.
   * *Desventaja:* Alto acoplamiento. Si el día de mañana se requiere agregar una nueva forma de notificación (ej. enviar un email, un webhook o registrar auditoría), obligaría a modificar el código fuente del servicio principal, violando el principio de Abierto/Cerrado (OCP).
2. **Alternativa B (Patrón Observer y Inyección de Dependencias):** Desacoplar la notificación utilizando el **Patrón Observer**. El servicio emite un evento al crear el producto, y los observadores registrados reaccionan de forma autónoma. Además, se inyecta el repositorio por constructor (DIP).
   * *Ventaja:* Extensibilidad total, cumplimiento de SOLID y facilidades para pruebas unitarias mediante mocks.
3. **Alternativa C (Conservar el diseño sin alertas automáticas):** Dejar el CRUD básico de productos sin ningún sistema de aviso de stock.
   * *Desventaja:* Incumple directamente con el requerimiento funcional del negocio (las alertas de punto de reorden).

---

## 4. Decisión
* **Opción elegida:** **Alternativa B (Patrón Observer + Inyección de Dependencias + Separación de Validación con `StockValidator`)**.
* **Fundamentación:** Se decidió implementar un diseño desacoplado porque permite mantener el código limpio y preparado para escalar. Delegamos la validación estricta de reglas de stock en `stockValidator.js` (cumpliendo con SRP) y el aviso de alertas en `stockAlertObserver.js`. 
* Asimismo, el uso de inyección de dependencias en el constructor de `ProductoService` nos otorga flexibilidad ante futuros cambios en la capa de datos.

---

## 5. Evidencia y Trade-offs
* **Referencias al código:** 
  * Validación centralizada en `src/services/stockValidator.js`.
  * Emisión y suscripción de eventos en `src/services/productoService.js`.
  * Reacción desacoplada en `src/services/observers/stockAlertObserver.js`.
* **Beneficios:** 
  * Código altamente legible y mantenible.
  * Facilidad para extender el sistema con nuevos observadores (por ejemplo, notificaciones push o por correo) sin tocar la lógica central del servicio.
  * Código preparado para testing unitario.
* **Costos / Trade-offs:** 
  * Incremento leve en la cantidad de archivos y abstracciones en comparación con un script monolítico básico, lo cual demanda una curva de aprendizaje inicial levemente mayor para el equipo, compensada ampliamente por la robustez estructural.