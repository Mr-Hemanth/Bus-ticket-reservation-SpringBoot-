import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FaCalendarAlt, FaBus, FaRoute, FaClock, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './ScheduleManagement.css';

const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({
        busId: '',
        routeId: '',
        travelDate: '',
        departureTime: '',
        arrivalTime: '',
        availableSeats: ''
    });

    useEffect(() => {
        fetchSchedules();
        fetchBuses();
        fetchRoutes();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await adminAPI.getSchedules();
            setSchedules(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch schedules');
            setLoading(false);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await adminAPI.getBuses();
            setBuses(response.data);
        } catch (err) {
            setError('Failed to fetch buses');
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await adminAPI.getRoutes();
            setRoutes(response.data);
        } catch (err) {
            setError('Failed to fetch routes');
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
            // Format the schedule data to match backend expectations
            const scheduleData = {
                bus: { id: parseInt(formData.busId) },
                route: { id: parseInt(formData.routeId) },
                travelDate: formData.travelDate,
                departureTime: formData.departureTime,
                arrivalTime: formData.arrivalTime,
                availableSeats: parseInt(formData.availableSeats)
            };

            if (editingSchedule) {
                await adminAPI.updateSchedule(editingSchedule.id, scheduleData);
            } else {
                await adminAPI.createSchedule(scheduleData);
            }
            resetForm();
            fetchSchedules();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            busId: schedule.busId,
            routeId: schedule.routeId,
            travelDate: schedule.travelDate,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            availableSeats: schedule.availableSeats
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await adminAPI.deleteSchedule(id);
                fetchSchedules();
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const resetForm = () => {
        setFormData({ 
            busId: '', 
            routeId: '', 
            travelDate: '', 
            departureTime: '', 
            arrivalTime: '', 
            availableSeats: '' 
        });
        setEditingSchedule(null);
        setShowForm(false);
        setError('');
    };

    if (loading) return <div className="loading">Loading schedules...</div>;

    return (
        <div className="schedule-management">
            <h1><FaCalendarAlt className="page-icon" /> Schedule Management</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
                className="add-schedule-btn" 
                onClick={() => { setShowForm(true); setEditingSchedule(null); setError(''); }}
            >
                <FaPlus className="btn-icon" />
                Add New Schedule
            </button>
            
            {showForm && (
                <form onSubmit={handleSubmit} className="schedule-form">
                    <h3>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h3>
                    <div className="form-group">
                        <label><FaBus className="input-icon" /> Bus:</label>
                        <select
                            name="busId"
                            value={formData.busId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Bus</option>
                            {buses.map(bus => (
                                <option key={bus.id} value={bus.id}>
                                    {bus.busNumber} (Total Seats: {bus.totalSeats})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label><FaRoute className="input-icon" /> Route:</label>
                        <select
                            name="routeId"
                            value={formData.routeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Route</option>
                            {routes.map(route => (
                                <option key={route.id} value={route.id}>
                                    {route.source} to {route.destination}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label><FaCalendarAlt className="input-icon" /> Travel Date:</label>
                        <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaClock className="input-icon" /> Departure Time:</label>
                        <input
                            type="time"
                            name="departureTime"
                            value={formData.departureTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaClock className="input-icon" /> Arrival Time:</label>
                        <input
                            type="time"
                            name="arrivalTime"
                            value={formData.arrivalTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaBus className="input-icon" /> Available Seats:</label>
                        <input
                            type="number"
                            name="availableSeats"
                            value={formData.availableSeats}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            <FaCheck className="btn-icon" />
                            {editingSchedule ? 'Update' : 'Add'} Schedule
                        </button>
                        <button type="button" onClick={resetForm} className="cancel-btn">
                            <FaTimes className="btn-icon" />
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            
            <div className="schedule-list">
                <h2>All Schedules</h2>
                {schedules.length === 0 ? (
                    <p>No schedules found</p>
                ) : (
                    <table className="schedule-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bus</th>
                                <th>Route</th>
                                <th>Date</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Available Seats</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map(schedule => (
                                <tr key={schedule.id}>
                                    <td>{schedule.id}</td>
                                    <td>{schedule.busNumber}</td>
                                    <td>{schedule.source} to {schedule.destination}</td>
                                    <td>{new Date(schedule.travelDate).toLocaleDateString()}</td>
                                    <td>{schedule.departureTime}</td>
                                    <td>{schedule.arrivalTime}</td>
                                    <td>{schedule.availableSeats}</td>
                                    <td>₹{schedule.price}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleEdit(schedule)} 
                                            className="edit-btn"
                                        >
                                            <FaEdit className="btn-icon" />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(schedule.id)} 
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

export default ScheduleManagement;