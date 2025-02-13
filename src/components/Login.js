// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setAdmin, setUser }) {
    const [role, setRole] = useState('admin'); // default selection
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'admin') {
                // Admin login endpoint
                const response = await axios.post('http://localhost:8080/admin/login', null, {
                    params: { username, password },
                });
                setAdmin(response.data);
                navigate('/dashboard'); // Admin dashboard route
            } else {
                // User login endpoint
                const response = await axios.post('http://localhost:8080/admin/users/login', null, {
                    params: { username, password },
                });
                setUser(response.data);
                navigate('/user-dashboard'); // Assume a separate user dashboard route
            }
        } catch (err) {
            console.error(err);
            setError('Invalid login credentials');
        }
    };

    return (
        <div style={{ margin: '50px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
