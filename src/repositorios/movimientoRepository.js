const db = require("../config/database");

class MovimientoRepository {
  async registrar(connection, { producto_id, tipo, cantidad, motivo }) {
    const [result] = await connection.query(
      `INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo)
       VALUES (?, ?, ?, ?)`,
      [producto_id, tipo, cantidad, motivo],
    );
    return { id: result.insertId, producto_id, tipo, cantidad, motivo };
  }

  async obtenerPorProductoId(producto_id) {
    const [rows] = await db.query(
      "SELECT * FROM movimientos_stock WHERE producto_id = ? ORDER BY fecha DESC",
      [producto_id],
    );
    return rows;
  }

  async listarPaginado({ page = 1, limit = 10, search = "", tipo = "" }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    const condiciones = [];
    const params = [];

    if (search && search.trim()) {
      condiciones.push("(m.motivo LIKE ? OR p.nombre LIKE ?)");
      const termino = `%${search.trim()}%`;
      params.push(termino, termino);
    }

    if (tipo && (tipo === "INGRESO" || tipo === "EGRESO")) {
      condiciones.push("m.tipo = ?");
      params.push(tipo);
    }

    const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM movimientos_stock m
       INNER JOIN productos p ON m.producto_id = p.id
       ${whereClause}`,
      params,
    );
    const total = countRows[0].total;

    const [items] = await db.query(
      `SELECT m.*, p.nombre AS producto_nombre
       FROM movimientos_stock m
       INNER JOIN productos p ON m.producto_id = p.id
       ${whereClause}
       ORDER BY m.fecha DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    return {
      items,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }
}

module.exports = new MovimientoRepository();