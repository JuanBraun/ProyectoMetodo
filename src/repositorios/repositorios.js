const db = require('../config/database');

class ProductoRepository {
    async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM productos');
        return rows;
    }

    async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async crear(producto) {
        const { codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_maximo, categoria_id } = producto;
        const [result] = await db.query(
            `INSERT INTO productos 
            (codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_max, categoria_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo,stock_maximo, categoria_id]
        );
        return { id: result.insertId, ...producto };
    }

    async actualizar(id, producto) {
        const { codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_maximo, categoria_id } = producto;
        await db.query(
            `UPDATE productos 
             SET codigo_barras = ?, nombre = ?, descripcion = ?, precio_venta = ?, 
                 stock_actual = ?, stock_minimo = ?, stock_max = ?, categoria_id = ?
             WHERE id = ?`,
            [codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_maximo, categoria_id, id]
        );
        return { id, ...producto };
    }

    async eliminar(id) {
        const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new ProductoRepository();