// src/components/ChangePassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword({ admin }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        // Basic check to ensure passwords match
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            // Call the change-password endpoint.
            // Note: In production, you should pass credentials in a safer way.
            await axios.put(
                `http://localhost:8080/admin/change-password?adminId=${admin.id}&newPassword=${encodeURIComponent(newPassword)}`
            );
            setMessage("Password changed successfully.");
            // Optionally, navigate away or clear the form
            // navigate('/dashboard'); // Uncomment if you want to redirect after changing password.
        } catch (error) {
            console.error(error);
            setMessage("Error changing password. Please try again.");
        }
    };

    return (
        <div>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
                <div>
                    <label>New Password: </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password: </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ChangePassword;
