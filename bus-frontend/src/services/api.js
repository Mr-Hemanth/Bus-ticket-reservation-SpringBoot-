import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// Admin API
export const adminAPI = {
    // Buses
    getBuses: () => api.get('/admin/buses'),
    createBus: (busData) => api.post('/admin/buses', busData),
    updateBus: (id, busData) => api.put(`/admin/buses/${id}`, busData),
    deleteBus: (id) => api.delete(`/admin/buses/${id}`),
    
    // Routes
    getRoutes: () => api.get('/admin/routes'),
    createRoute: (routeData) => api.post('/admin/routes', routeData),
    updateRoute: (id, routeData) => api.put(`/admin/routes/${id}`, routeData),
    deleteRoute: (id) => api.delete(`/admin/routes/${id}`),
    
    // Schedules
    getSchedules: () => api.get('/admin/schedules'),
    createSchedule: (scheduleData) => api.post('/admin/schedules', scheduleData),
    updateSchedule: (id, scheduleData) => api.put(`/admin/schedules/${id}`, scheduleData),
    deleteSchedule: (id) => api.delete(`/admin/schedules/${id}`),
    
    // Bookings
    getAllBookings: () => api.get('/admin/bookings'),
    getBookingById: (id) => api.get(`/admin/bookings/${id}`),
};

// Customer API
export const customerAPI = {
    // Schedules
    searchSchedules: (source, destination, travelDate) => 
        api.get(`/schedules/search?source=${source}&destination=${destination}&travelDate=${travelDate}`),
    
    getScheduleById: (id) => api.get(`/schedules/${id}`),
    
    // Bookings
    getMyBookings: () => api.get('/customer/bookings'),
    bookSeats: (bookingData) => api.post('/customer/bookings', bookingData),
    cancelBooking: (id) => api.put(`/customer/bookings/${id}/cancel`),
    getBookingById: (id) => api.get(`/customer/bookings/${id}`),
    
    // Get booked seats for a schedule
    getBookedSeatsForSchedule: (scheduleId) => api.get(`/schedules/${scheduleId}/booked-seats`),
};

export default api;