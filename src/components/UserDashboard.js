// src/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {PORTFORBE} from "../util/constants";

function UserDashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    // The cart is an array of objects: { product, quantity }
    const [cart, setCart] = useState([]);
    // Track desired quantity for each product (keyed by product ID)
    const [quantities, setQuantities] = useState({});

    // Fetch products from the backend.
    const fetchProducts = async () => {
        try {
            // Reusing the endpoint for getting products.
            const response = await axios.get(`http://localhost:${PORTFORBE}/admin/products`);
            setProducts(response.data);
            // Initialize quantity for each product to 1.
            const initialQuantities = {};
            response.data.forEach((product) => {
                initialQuantities[product.id] = 1;
            });
            setQuantities(initialQuantities);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch products when the component mounts.
    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle change in quantity input for a product.
    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };

    // Add a product to the cart with the specified quantity.
    const addToCart = (product) => {
        const qty = parseInt(quantities[product.id], 10) || 1;
        setCart((prevCart) => {
            const index = prevCart.findIndex((item) => item.product.id === product.id);
            if (index >= 0) {
                // If the product is already in the cart, update the quantity.
                const updatedCart = [...prevCart];
                updatedCart[index].quantity += qty;
                return updatedCart;
            } else {
                // Otherwise, add the product with the chosen quantity.
                return [...prevCart, { product, quantity: qty }];
            }
        });
    };

    // Calculate the order total.
    const orderTotal = cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    // Handle placing the order.
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        // Build the order payload.
        const orderItems = cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
        }));
        const payload = {
            userId: user.id,
            items: orderItems,
        };
        try {
            await axios.post(`http://localhost:${PORTFORBE}/purchases`, payload);
            alert("Order placed successfully!");
            setCart([]); // Clear the cart after ordering.
            setQuantities({}); // Reset quantities to 1.
        } catch (error) {
            console.error("Error placing order", error);
            alert("Error placing order.");
        }
    };

    // Logout handler.
    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    // Helper to get the proper image URL.
    // If product.imageUrl is "sporty-shoes-images/filename.jpg", we extract filename and build "/images/filename.jpg"
    const getImageUrl = (product) => {
        if (!product.imageUrl) {
            return ''; // or a default placeholder image URL.
        }
        const parts = product.imageUrl.split('/');
        const filename = parts[parts.length - 1];
        return `/images/${filename}`;
    };

    return (
        <div style={{ padding: '20px' }}>
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                }}
            >
                <h2>User Dashboard - Welcome, {user.username}</h2>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <h3>Products</h3>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {products.map((product) => (
                        <li
                            key={product.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {/* Display the product image */}
                                {product.imageUrl ? (
                                    <img
                                        src={getImageUrl(product)}
                                        alt={product.name}
                                        width="75"
                                        style={{ marginRight: '10px' }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            backgroundColor: '#eee',
                                            marginRight: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#999',
                                            fontSize: '12px'
                                        }}
                                    >
                                        No Image
                                    </div>
                                )}
                                <div>
                                    <strong>{product.name}</strong>
                                    <p>Price: ${product.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) =>
                                        handleQuantityChange(product.id, e.target.value)
                                    }
                                    style={{ width: '50px', marginRight: '10px' }}
                                />
                                <button onClick={() => addToCart(product)}>Add to Cart</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <h3>
                Cart (
                {cart.reduce((total, item) => total + item.quantity, 0)}{' '}
                {cart.reduce((total, item) => total + item.quantity, 0) === 1 ? 'item' : 'items'}
                )
            </h3>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.map((item, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>
                                {item.product.name} - ${item.product.price.toFixed(2)} x {item.quantity}
                            </li>
                        ))}
                    </ul>
                    <h4>Order Total: ${orderTotal.toFixed(2)}</h4>
                </>
            )}
            <button onClick={handlePlaceOrder} style={{ marginTop: '20px' }}>
                Place Order
            </button>
        </div>
    );
}

export default UserDashboard;
