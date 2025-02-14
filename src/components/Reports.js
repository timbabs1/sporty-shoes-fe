// src/components/Reports.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {PORTFORBE} from "../util/constants";

function Reports() {
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-01-31');
    const [categoryId, setCategoryId] = useState('');
    const [reports, setReports] = useState([]);

    const categories = [
        { id: '', name: 'All Categories' },
        { id: '1', name: 'Running' },
        { id: '2', name: 'Basketball' },
    ];

    // Function that fetches the reports from the API based on current state values
    const getReports = async () => {
        try {
            const params = { startDate, endDate };
            if (categoryId) {
                params.categoryId = categoryId;
            }
            const response = await axios.get(`http://localhost:${PORTFORBE}/admin/reports/purchases`, { params });
            setReports(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Event handler for the form submission
    const handleFetchReports = (e) => {
        e.preventDefault();
        getReports();
    };

    // Fetch default reports when the component mounts
    useEffect(() => {
        getReports();
    }, []);

    return (
        <div>
            <h3>Purchase Reports</h3>
            <form onSubmit={handleFetchReports}>
                <div>
                    <label>Start Date: </label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div>
                    <label>End Date: </label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
                <div>
                    <label>Category: </label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Get Report</button>
            </form>
            <h4 style={{ marginTop: '20px' }}>Reports</h4>
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Product</th>
                    <th>Purchase Date</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(r => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.user?.username}</td>
                        <td>{r.product?.name}</td>
                        <td>{r.purchaseDate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reports;

