// tests/inventario.test.js
const { describe, it, mock } = require("node:test");
const assert = require("node:assert/strict");

const StockValidator = require("../src/services/stockValidator");
const movimientoService = require("../src/services/movimientoService");
const productoService = require("../src/services/productoService");
const db = require("../src/config/database");
const movimientoRepository = require("../src/repositorios/movimientoRepository");

describe("Reglas de Negocio - Validación de Stock Inicial (Unitario puro)", () => {
  it("Caso NORMAL: acepta valores coherentes de stock inicial, mínimo y máximo", () => {
    // Arrange & Act & Assert
    assert.doesNotThrow(() => {
      StockValidator.validarStockInicial({
        stock_actual: 50,
        stock_minimo: 10,
        stock_maximo: 100,
      });
    });
  });

  it("Caso LÍMITE (borde): permite que el stock inicial sea exactamente igual al máximo", () => {
    assert.doesNotThrow(() => {
      StockValidator.validarStockInicial({
        stock_actual: 100,
        stock_minimo: 10,
        stock_maximo: 100,
      });
    });
  });

  it("Caso ERROR: lanza error 400 si el stock mínimo es igual o mayor al máximo", () => {
    assert.throws(
      () => {
        StockValidator.validarStockInicial({
          stock_actual: 10,
          stock_minimo: 50,
          stock_maximo: 50,
        });
      },
      (err) => {
        assert.equal(err.status, 400);
        assert.match(err.message, /stock mínimo no puede ser mayor o igual/i);
        return true;
      }
    );
  });

  it("Caso ERROR: lanza error 400 si el stock inicial es negativo", () => {
    assert.throws(
      () => {
        StockValidator.validarStockInicial({
          stock_actual: -5,
          stock_minimo: 10,
          stock_maximo: 100,
        });
      },
      { status: 400 }
    );
  });
});

describe("Reglas de Negocio - Registro de Movimientos (Con Stubs/Mocks)", () => {
  it("Caso ERROR: rechaza un EGRESO cuando la cantidad supera el stock actual", async () => {
    // Arrange: simulamos un producto con stock 10 sin tocar MySQL
    const stubProducto = mock.method(productoService, "obtenerProducto", async () => ({
      id: 1,
      nombre: "Taladro",
      stock_actual: 10,
    }));

    try {
      // Act & Assert: intentamos sacar 15 unidades
      await assert.rejects(
        async () => {
          await movimientoService.registrarMovimiento({
            producto_id: 1,
            tipo: "EGRESO",
            cantidad: 15,
            motivo: "Retiro de obra",
          });
        },
        (err) => {
          assert.equal(err.status, 400);
          assert.match(err.message, /Stock insuficiente/i);
          return true;
        }
      );
    } finally {
      stubProducto.mock.restore();
    }
  });

  it("Caso LÍMITE: permite un EGRESO por el total exacto del stock (deja stock en 0)", async () => {
    // Arrange: simulamos producto con stock 10, conexión BD y repositorio
    const stubProducto = mock.method(productoService, "obtenerProducto", async () => ({
      id: 1,
      nombre: "Taladro",
      stock_actual: 10,
    }));
    const stubObserver = mock.method(productoService, "notificarObservers", () => {});
    const stubRepo = mock.method(movimientoRepository, "registrar", async () => ({ id: 99 }));
    const stubDb = mock.method(db, "getConnection", async () => ({
      beginTransaction: async () => {},
      query: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {},
    }));

    try {
      // Act: sacamos exactamente 10 unidades
      const resultado = await movimientoService.registrarMovimiento({
        producto_id: 1,
        tipo: "EGRESO",
        cantidad: 10,
        motivo: "Consumo total",
      });

      // Assert
      assert.equal(resultado.nuevo_stock, 0);
    } finally {
      stubProducto.mock.restore();
      stubObserver.mock.restore();
      stubRepo.mock.restore();
      stubDb.mock.restore();
    }
  });
});