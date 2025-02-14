// src/components/Products.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {PORTFORBE} from "../util/constants";

function Products() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:${PORTFORBE}/admin/products`);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // In a real app, categories would be fetched from an endpoint.
    useEffect(() => {
        setCategories([
            { id: 1, name: 'Running' },
            { id: 2, name: 'Basketball' }
        ]);
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        console.log('e.target.files[0]', e.target.files[0]);
        console.log('e', e);
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create FormData to send both product details and file.
            const formData = new FormData();
            // Append the product as a JSON blob.
            formData.append('product', new Blob([JSON.stringify({
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                category: { id: parseInt(newProduct.categoryId) },
                // Optionally include imageUrl if updating and image not changed.
                ...(editing ? {} : {})
            })], { type: 'application/json' }));
            // Append the image file if available.
            console.log('imageFile', imageFile);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (editing) {
                await axios.put(`http://localhost:${PORTFORBE}/admin/products/${editing}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setEditing(null);
            } else {
                await axios.post(`http://localhost:${PORTFORBE}/admin/products`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setNewProduct({ name: '', price: '', categoryId: '' });
            setImageFile(null);
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
            categoryId: product.category.id
        });
        // Optionally, you can show the existing image or leave imageFile empty.
        setImageFile(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:${PORTFORBE}/admin/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const getImageUrl = (imageUrl) => {
        // Assuming product.imageUrl is "sporty-shoes-images/filename.jpg"
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];
        return `/images/${filename}`;
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
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginTop: '10px' }}
                />
                <button type="submit">{editing ? 'Update Product' : 'Add Product'}</button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setNewProduct({ name: '', price: '', categoryId: '' });
                            setImageFile(null);
                        }}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            <h4>Product List</h4>
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Image</th>
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
                            {prod.imageUrl ? (
                                <img src={`${getImageUrl(prod.imageUrl)}`} alt={prod.name} width="50" />
                            ) : (
                                'No Image'
                            )}
                        </td>
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
