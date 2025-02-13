// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';

function App() {
    const [admin, setAdmin] = useState(null);
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setAdmin={setAdmin} setUser={setUser} />} />
                <Route
                    path="/dashboard/*"
                    element={admin ? <Dashboard admin={admin} /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/user-dashboard"
                    element={user ? <UserDashboard user={user} setUser={setUser} /> : <Navigate to="/login" replace />}
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
