import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FaRoute, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './RouteManagement.css';

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        source: '',
        destination: ''
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await adminAPI.getRoutes();
            setRoutes(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch routes');
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
            if (editingRoute) {
                await adminAPI.updateRoute(editingRoute.id, formData);
            } else {
                await adminAPI.createRoute(formData);
            }
            resetForm();
            fetchRoutes();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (route) => {
        setEditingRoute(route);
        setFormData({
            source: route.source,
            destination: route.destination
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await adminAPI.deleteRoute(id);
                fetchRoutes();
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const resetForm = () => {
        setFormData({ source: '', destination: '' });
        setEditingRoute(null);
        setShowForm(false);
        setError('');
    };

    if (loading) return <div className="loading">Loading routes...</div>;

    return (
        <div className="route-management">
            <h1><FaRoute className="page-icon" /> Route Management</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
                className="add-route-btn" 
                onClick={() => { setShowForm(true); setEditingRoute(null); setError(''); }}
            >
                <FaPlus className="btn-icon" />
                Add New Route
            </button>
            
            {showForm && (
                <form onSubmit={handleSubmit} className="route-form">
                    <h3>{editingRoute ? 'Edit Route' : 'Add New Route'}</h3>
                    <div className="form-group">
                        <label><FaRoute className="input-icon" /> Source:</label>
                        <input
                            type="text"
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaRoute className="input-icon" /> Destination:</label>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            <FaCheck className="btn-icon" />
                            {editingRoute ? 'Update' : 'Add'} Route
                        </button>
                        <button type="button" onClick={resetForm} className="cancel-btn">
                            <FaTimes className="btn-icon" />
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            
            <div className="route-list">
                <h2>All Routes</h2>
                {routes.length === 0 ? (
                    <p>No routes found</p>
                ) : (
                    <table className="route-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map(route => (
                                <tr key={route.id}>
                                    <td>{route.id}</td>
                                    <td>{route.source}</td>
                                    <td>{route.destination}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleEdit(route)} 
                                            className="edit-btn"
                                        >
                                            <FaEdit className="btn-icon" />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(route.id)} 
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

export default RouteManagement;