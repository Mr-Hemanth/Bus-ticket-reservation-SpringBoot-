# Bus Ticket Reservation System

A complete, full-stack bus ticket reservation system built with Spring Boot and React.

## Features

### Authentication & Authorization
- User registration and login
- Roles: ADMIN, CUSTOMER
- Password encryption using BCrypt
- JWT-based authentication
- Role-based access to APIs

### Admin Features
- Add / update / delete buses
- Define routes (source, destination)
- Set travel date, departure time, arrival time
- Set seat count and ticket price
- View all bookings
- Cancel bookings

### Customer Features
- Register & login
- Search buses by source, destination, and travel date
- View bus details
- Select seats
- Book tickets
- View booking history
- Cancel booking

### Ticket & Seat Management
- Prevent double booking of seats
- Update seat availability in real time
- Automatically calculate total price
- Booking status: CONFIRMED / CANCELLED

## Technology Stack

### Backend
- Spring Boot 3.1.0
- Spring Data JPA (Hibernate)
- Spring Security with JWT
- MySQL database
- Maven for dependency management

### Frontend
- React 18.2.0 (functional components with hooks)
- React Router 6.8.1
- Axios for API calls
- Plain CSS (responsive, mobile-friendly)

## Database Schema

The system uses the following tables:
- users (id, name, email, password, role)
- buses (id, bus_number, total_seats, price)
- routes (id, source, destination)
- schedules (id, bus_id, route_id, travel_date, departure_time, arrival_time, available_seats)
- bookings (id, user_id, schedule_id, seat_numbers, total_price, status, booking_time)

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js and npm
- MySQL server

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd bus-backend
   ```

2. Update the database configuration in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bus_reservation?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. Create the database:
   ```sql
   CREATE DATABASE bus_reservation;
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd bus-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

### Database Initialization

Run the SQL schema from `bus_reservation_schema.sql` to create the database tables and sample data.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin APIs
- `GET /api/admin/buses` - Get all buses
- `POST /api/admin/buses` - Create bus
- `PUT /api/admin/buses/{id}` - Update bus
- `DELETE /api/admin/buses/{id}` - Delete bus

- `GET /api/admin/routes` - Get all routes
- `POST /api/admin/routes` - Create route
- `PUT /api/admin/routes/{id}` - Update route
- `DELETE /api/admin/routes/{id}` - Delete route

- `GET /api/admin/schedules` - Get all schedules
- `POST /api/admin/schedules` - Create schedule
- `PUT /api/admin/schedules/{id}` - Update schedule
- `DELETE /api/admin/schedules/{id}` - Delete schedule

- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/bookings/{id}` - Get booking by ID

### Customer APIs
- `GET /api/schedules/search?source={source}&destination={destination}&travelDate={date}` - Search schedules
- `GET /api/schedules/{scheduleId}/booked-seats` - Get booked seats for a schedule
- `POST /api/customer/bookings` - Book seats
- `PUT /api/customer/bookings/{id}/cancel` - Cancel booking
- `GET /api/customer/bookings` - Get user's bookings
- `GET /api/customer/bookings/{id}` - Get booking by ID

## System Architecture

### Backend Architecture
The backend follows a layered architecture:
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Handles database operations
- **Entity Layer**: JPA entities representing database tables
- **Security Layer**: JWT authentication and authorization

### Authentication Flow
1. User registers/login via credentials
2. Server validates credentials and generates JWT
3. JWT is sent to client and stored in localStorage
4. JWT is included in Authorization header for protected endpoints
5. Server validates JWT for each protected request

### Seat Booking Logic
1. User selects seats for a schedule
2. System checks if seats are available
3. Transaction locks the schedule to prevent race conditions
4. System verifies no other booking has reserved the same seats
5. If available, booking is created and seat count is updated
6. If not available, transaction is rolled back

### Database Relationships
- User (1) -> (Many) Booking
- Bus (1) -> (Many) Schedule
- Route (1) -> (Many) Schedule
- Schedule (1) -> (Many) Booking
- Booking (1) -> (Many) Seat Numbers (via booking_seats table)

## Security Features

- Passwords are encrypted using BCrypt
- JWT tokens are used for authentication
- Role-based access control
- SQL injection prevention through JPA
- XSS prevention through proper encoding
- Secure session management

## Running the Application

1. Start MySQL server
2. Create the database using the schema file
3. Start the backend server
4. Start the frontend server
5. Access the application at `http://localhost:3000`

## Default Users

After running the schema file, the following users are available:
- Admin: admin@example.com / password
- Customer: john@example.com / password
- Customer: jane@example.com / password