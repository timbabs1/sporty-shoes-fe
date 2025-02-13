// src/components/Dashboard.js
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Products from './Products';
import Users from './Users';
import Reports from './Reports';
import ChangePassword from './ChangePassword';

function Dashboard({ admin }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // For simplicity, clear the admin and reload the page
        navigate('/login');
        window.location.reload();
    };

    return (
        <div style={{ padding: '20px' }}>
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h2>Welcome, {admin.username}</h2>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <nav style={{ marginTop: '20px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
                    <li>
                        <NavLink
                            to="products"
                            style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
                        >
                            Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="users"
                            style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
                        >
                            Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="reports"
                            style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
                        >
                            Reports
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="change-password"
                            style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
                        >
                            Change Password
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div style={{ marginTop: '30px' }}>
                <Routes>
                    <Route path="products" element={<Products />} />
                    <Route path="users" element={<Users />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="change-password" element={<ChangePassword admin={admin} />} />
                    {/* Default to products if no sub-route is provided */}
                    <Route path="*" element={<Products />} />
                </Routes>
            </div>
        </div>
    );
}

export default Dashboard;
