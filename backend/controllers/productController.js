import { sql } from '../config/db.js';

export const getProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log("error in getProducts function", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createProduct = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: 'all fields are required' });
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name}, ${price}, ${image})
            RETURNING *
        `
        res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.log("error in createProduct function", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await sql`
            SELECT * FROM products WHERE id=${id}
        `
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("error in getProduct function", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updateProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id}
            RETURNING *
        `

        if (updateProduct.length === 0) {
            return res.status(404).json({ success: false, message: 'product not found' });
        }

        res.status(200).json({ success: true, data: updateProduct[0] });
    } catch (error) {
        console.log("error in updateProduct function", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await sql`
            DELETE FROM products
            WHERE id=${id}
            RETURNING *        
        `
        
        if (deleteProduct.length === 0) {
            return res.status(404).json({ success: false, message: 'product not found' });
        }

        res.status(200).json({ success: true, data: deleteProduct[0] });
    } catch (error) {
        console.log("error in deleteProduct function", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}