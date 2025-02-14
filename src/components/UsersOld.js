// src/components/Users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {PORTFORBE} from "../util/constants";

function Users() {
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState('');

    const fetchUsers = async (searchKeyword = '') => {
        try {
            const response = await axios.get(`http://localhost:${PORTFORBE}/admin/users`, {
                params: { keyword: searchKeyword },
            });
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(keyword);
    };

    return (
        <div>
            <h3>Users</h3>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <table border="1" cellPadding="5" style={{ marginTop: '20px' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;

