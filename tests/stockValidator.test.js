// tests/stockValidator.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const StockValidator = require('../src/services/stockValidator');

describe('StockValidator - validarStockInicial', () => {
  // 1. CASO NORMAL
  it('permite valores válidos dentro del rango (normal)', () => {
    assert.doesNotThrow(() => {
      StockValidator.validarStockInicial({
        stock_actual: 10,
        stock_minimo: 5,
        stock_maximo: 20,
      });
    });
  });

  // 2. CASOS LÍMITE (borde)
  it('permite stock_actual en 0 (límite inferior)', () => {
    assert.doesNotThrow(() => {
      StockValidator.validarStockInicial({
        stock_actual: 0,
        stock_minimo: 2,
        stock_maximo: 10,
      });
    });
  });

  it('permite stock_actual igual al stock_maximo (límite superior)', () => {
    assert.doesNotThrow(() => {
      StockValidator.validarStockInicial({
        stock_actual: 20,
        stock_minimo: 5,
        stock_maximo: 20,
      });
    });
  });

  it('lanza error 400 cuando stock_minimo es igual a stock_maximo (borde inválido)', () => {
    assert.throws(
      () => {
        StockValidator.validarStockInicial({
          stock_actual: 5,
          stock_minimo: 10,
          stock_maximo: 10,
        });
      },
      (err) => err.status === 400 && /mínimo no puede ser mayor o igual/i.test(err.message)
    );
  });

  // 3. CASOS DE ERROR
  it('lanza error 400 si el stock_actual es negativo', () => {
    assert.throws(
      () => {
        StockValidator.validarStockInicial({
          stock_actual: -1,
          stock_minimo: 5,
          stock_maximo: 20,
        });
      },
      (err) => err.status === 400 && /negativo/i.test(err.message)
    );
  });

  it('lanza error 400 si el stock_actual supera el stock_maximo', () => {
    assert.throws(
      () => {
        StockValidator.validarStockInicial({
          stock_actual: 25,
          stock_minimo: 5,
          stock_maximo: 20,
        });
      },
      (err) => err.status === 400 && /superar el límite/i.test(err.message)
    );
  });
});