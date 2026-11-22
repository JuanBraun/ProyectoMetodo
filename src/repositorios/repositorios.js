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
        const { codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_max, categoria_id, ubicacion_id } = producto;
        const [result] = await db.query(
            `INSERT INTO productos 
            (codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_max, categoria_id, ubicacion_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_max, categoria_id, ubicacion_id]
        );
        
        const [rows] = await db.query(
            `SELECT p.*, u.pasillo, u.estante, u.nivel, u.descripcion as descripcion_ubicacion 
            FROM productos p 
            LEFT JOIN ubicaciones u ON p.ubicacion_id = u.id 
            WHERE p.id = ?`,
            [result.insertId]
        );
        
        const row = rows[0];
        
        return {
            id: row.id,
            codigo_barras: row.codigo_barras,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio_venta: row.precio_venta,
            stock_actual: row.stock_actual,
            stock_minimo: row.stock_minimo,
            stock_max: row.stock_max,
            categoria_id: row.categoria_id,
            creado_en: row.creado_en,
            ubicacion: row.ubicacion_id ? {
                id: row.ubicacion_id,
                pasillo: row.pasillo,
                estante: row.estante,
                nivel: row.nivel,
                descripcion: row.descripcion_ubicacion
            } : null
        };
    }

    async actualizar(id, producto) {
        const { codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_max, categoria_id, ubicacion_id } = producto;
        await db.query(
            `UPDATE productos 
            SET codigo_barras = ?, nombre = ?, descripcion = ?, precio_venta = ?, 
                stock_actual = ?, stock_minimo = ?, stock_max = ?, categoria_id = ?, ubicacion_id = ? 
            WHERE id = ?`,
            [codigo_barras, nombre, descripcion, precio_venta, stock_actual, stock_minimo, stock_max, categoria_id, ubicacion_id, id]
        );
        return { id, ...producto };
    }

    async eliminar(id) {
        const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async obtenerSiguienteCodigoBarras() {
        const [rows] = await db.query(
            `SELECT MAX(CAST(SUBSTRING(codigo_barras, 6) AS UNSIGNED)) AS max_num
             FROM productos
             WHERE codigo_barras REGEXP '^75000[0-9]{4}$'`
        );
        const siguiente = (rows[0]?.max_num || 0) + 1;
        return `75000${String(siguiente).padStart(4, '0')}`;
    }
}

module.exports = new ProductoRepository();