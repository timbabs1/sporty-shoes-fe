// src/components/Users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [userForm, setUserForm] = useState({ username: '', email: '', password: '' });
    const [editingUser, setEditingUser] = useState(null);

    // Fetch users from the backend, optionally filtered by a search keyword.
    const fetchUsers = async (searchKeyword = '') => {
        try {
            const response = await axios.get('http://localhost:8080/admin/users', {
                params: { keyword: searchKeyword },
            });
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Load the users when the component mounts.
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handler for the search form.
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(keyword);
    };

    // Handler for form field changes.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for submitting the create/update form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update existing user.
                // If password is empty, it won't be updated.
                await axios.put(`http://localhost:8080/admin/users/${editingUser.id}`, userForm);
                setEditingUser(null);
            } else {
                // Create new user.
                await axios.post('http://localhost:8080/admin/users', userForm);
            }
            // Reset the form and refresh the user list.
            setUserForm({ username: '', email: '', password: '' });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    // Set the form with the user info when editing.
    const handleEdit = (user) => {
        setEditingUser(user);
        // Prepopulate username and email. Leave password blank.
        setUserForm({ username: user.username, email: user.email, password: '' });
    };

    // Delete a user by ID.
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/admin/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Users</h3>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            <hr />

            {/* Create / Update Form */}
            <h4>{editingUser ? 'Edit User' : 'Create User'}</h4>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={userForm.username}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={handleInputChange}
                    // Require password if creating a new user; optional when updating.
                    required={!editingUser}
                />
                <button type="submit">{editingUser ? 'Update User' : 'Create User'}</button>
                {editingUser && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingUser(null);
                            setUserForm({ username: '', email: '', password: '' });
                        }}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Users Table */}
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                            <button onClick={() => handleEdit(u)}>Edit</button>
                            <button onClick={() => handleDelete(u.id)} style={{ marginLeft: '10px' }}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
