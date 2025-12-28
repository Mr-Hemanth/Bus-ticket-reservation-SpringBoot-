import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FaBus, FaEdit, FaTrash, FaPlus, FaTimes, FaCheck } from 'react-icons/fa';
import './BusManagement.css';

const BusManagement = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingBus, setEditingBus] = useState(null);
    const [formData, setFormData] = useState({
        busNumber: '',
        totalSeats: '',
        price: ''
    });

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await adminAPI.getBuses();
            setBuses(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch buses');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBus) {
                await adminAPI.updateBus(editingBus.id, formData);
            } else {
                await adminAPI.createBus(formData);
            }
            resetForm();
            fetchBuses();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (bus) => {
        setEditingBus(bus);
        setFormData({
            busNumber: bus.busNumber,
            totalSeats: bus.totalSeats,
            price: bus.price
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await adminAPI.deleteBus(id);
                fetchBuses();
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const resetForm = () => {
        setFormData({ busNumber: '', totalSeats: '', price: '' });
        setEditingBus(null);
        setShowForm(false);
        setError('');
    };

    if (loading) return <div className="loading">Loading buses...</div>;

    return (
        <div className="bus-management">
            <h1>Bus Management</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
                className="add-bus-btn" 
                onClick={() => { setShowForm(true); setEditingBus(null); setError(''); }}
            >
                <FaPlus className="btn-icon" />
                Add New Bus
            </button>
            
            {showForm && (
                <form onSubmit={handleSubmit} className="bus-form">
                    <h3>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h3>
                    <div className="form-group">
                        <label>Bus Number:</label>
                        <input
                            type="text"
                            name="busNumber"
                            value={formData.busNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Seats:</label>
                        <input
                            type="number"
                            name="totalSeats"
                            value={formData.totalSeats}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            <FaCheck className="btn-icon" />
                            {editingBus ? 'Update' : 'Add'} Bus
                        </button>
                        <button type="button" onClick={resetForm} className="cancel-btn">
                            <FaTimes className="btn-icon" />
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            
            <div className="bus-list">
                <h2>All Buses</h2>
                {buses.length === 0 ? (
                    <p>No buses found</p>
                ) : (
                    <table className="bus-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bus Number</th>
                                <th>Total Seats</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map(bus => (
                                <tr key={bus.id}>
                                    <td>{bus.id}</td>
                                    <td>{bus.busNumber}</td>
                                    <td>{bus.totalSeats}</td>
                                    <td>₹{bus.price}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleEdit(bus)} 
                                            className="edit-btn"
                                        >
                                            <FaEdit className="btn-icon" />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(bus.id)} 
                                            className="delete-btn"
                                        >
                                            <FaTrash className="btn-icon" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BusManagement;