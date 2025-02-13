// src/components/Products.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/products');
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // For demonstration, we set some dummy categories.
    useEffect(() => {
        setCategories([
            { id: 1, name: 'Running' },
            { id: 2, name: 'Basketball' },
        ]);
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productToSend = {
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                category: { id: parseInt(newProduct.categoryId, 10) },
            };
            if (editing) {
                await axios.put(`http://localhost:8080/admin/products/${editing}`, productToSend);
                setEditing(null);
            } else {
                await axios.post('http://localhost:8080/admin/products', productToSend);
            }
            setNewProduct({ name: '', price: '', categoryId: '' });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (product) => {
        setEditing(product.id);
        setNewProduct({
            name: product.name,
            price: product.price,
            categoryId: product.category.id,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/admin/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Manage Products</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                />
                <select name="categoryId" value={newProduct.categoryId} onChange={handleInputChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <button type="submit">{editing ? 'Update Product' : 'Add Product'}</button>
            </form>
            <h4>Product List</h4>
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(prod => (
                    <tr key={prod.id}>
                        <td>{prod.name}</td>
                        <td>{prod.price}</td>
                        <td>{prod.category?.name}</td>
                        <td>
                            <button onClick={() => handleEdit(prod)}>Edit</button>
                            <button onClick={() => handleDelete(prod.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;

