// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {PORTFORBE} from "../util/constants";

function Login({ setAdmin, setUser }) {
    const [role, setRole] = useState('admin'); // default selection
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // only used for registration
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'admin') {
                const response = await axios.post(`http://localhost:${PORTFORBE}/admin/login`, null, {
                    params: { username, password },
                });
                setAdmin(response.data);
                navigate('/dashboard');
            } else {
                // User login
                const response = await axios.post(`http://localhost:${PORTFORBE}/admin/users/login`, null, {
                    params: { username, password },
                });
                setUser(response.data);
                navigate('/user-dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid login credentials');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            // Registration endpoint for users is POST /users
            const payload = { username, email, password };
            const response = await axios.post(`http://localhost:${PORTFORBE}/admin/users`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            // Optionally, you can auto-login the user after registration:
            setUser(response.data);
            navigate('/user-dashboard');
        } catch (err) {
            console.error(err);
            setError('Error creating account. Please try again.');
        }
    };

    return (
        <div style={{ margin: '50px' }}>
            <h2>{role === 'admin' ? 'Admin Login' : isRegister ? 'Register Account' : 'User Login'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Role selection */}
            <div>
                <label>Select Role: </label>
                <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        // Reset registration flag when switching roles
                        setIsRegister(false);
                        resetForm();
                    }}
                >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            {/* If role is user, show a toggle for register vs login */}
            {role === 'user' && (
                <div style={{ marginTop: '10px' }}>
                    <button onClick={() => { setIsRegister(false); resetForm(); }}>
                        LoginView
                    </button>
                    <button onClick={() => { setIsRegister(true); resetForm(); }} style={{ marginLeft: '10px' }}>
                        RegisterView
                    </button>
                </div>
            )}

            {role === 'admin' || !isRegister ? (
                // Login Form
                <form onSubmit={handleLoginSubmit} style={{ marginTop: '20px' }}>
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
                    <button type="submit" style={{ marginTop: '10px' }}>Login</button>
                </form>
            ) : (
                // Registration Form for Users
                <form onSubmit={handleRegisterSubmit} style={{ marginTop: '20px' }}>
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
                        <label>Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" style={{ marginTop: '10px' }}>Create Account</button>
                </form>
            )}
        </div>
    );
}

export default Login;
