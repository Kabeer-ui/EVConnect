# EVConnect — EV Charging Station Discovery Platform

EVConnect is an electric-vehicle charging platform designed for the Indian EV ecosystem. It aims to make it easier for EV drivers to discover charging stations, compare station details, and plan charging stops with useful information in one place.

As electric-vehicle adoption grows across India, drivers need accessible information about where charging stations are located and what charging options they offer. EVConnect brings station information into a searchable experience, with a focus on Indian charging infrastructure and a database-backed foundation for organizing station, user, and booking information.

## What EVConnect Offers

- **Charging station discovery:** Explore charging stations and review their available details.
- **Station information:** View location and charging-related attributes such as connector type, charging capacity, operator, pricing, operating hours, and station status where that information is available.
- **Search and filtering:** Narrow down station options using relevant station attributes.
- **Booking workflow:** Navigate the station-booking flow and manage booking information.
- **EV assistant:** Access an assistant interface intended to help users navigate charging-related information.
- **Impact information:** Explore information related to EV adoption and sustainable mobility.

The availability and accuracy of individual station attributes depend on the data recorded for each station. EVConnect is focused on Indian charging stations; it does not imply that every station has live operational or real-time connector availability data.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Navigation | React Router |
| Database | PostgreSQL |
| Database administration | pgAdmin |
| Version control | Git and GitHub |

The application is being developed with a PostgreSQL relational database to organize station and related application data. The database and application integration work is being carried out alongside the frontend.

## Database Focus

The database component is intended to provide a structured and consistent way to manage EV charging station information and related records. The project’s database work includes designing related tables, defining keys and constraints, and supporting queries needed for station discovery and booking-related workflows.

The station dataset is being prepared for India-focused use. Data quality, missing attributes, and consistency must be considered when importing and querying station records. Database diagrams and finalized schema details will be documented as the design is completed.

## Planned User Journey and Data Flow

The following workflow describes the intended behaviour once the application backend is connected to PostgreSQL. It documents the planned architecture and database interactions; it should not be read as confirmation that authentication, vehicle profiles, or database-backed bookings are already implemented.

### 1. Account registration

1. A visitor opens the registration page and enters their name, email address, and password.
2. The React frontend performs basic input validation and sends the registration request to a backend API over HTTPS.
3. The backend validates the request, checks that the email is not already registered, and securely hashes the password. The raw password is never stored in PostgreSQL.
4. The backend inserts the account into a `users` table. PostgreSQL generates the user's primary key, and constraints such as a unique email prevent duplicate accounts.
5. The API returns a success response. The frontend can then direct the user to vehicle setup or the main page.

**Planned database effect:** one row is created in `users`, containing account fields such as `user_id`, `name`, `email`, `password_hash`, and `created_at`. The exact columns will be finalized during schema design.

### 2. Login, authentication, and authorization

1. The user submits their email and password through the login form.
2. The backend retrieves the matching account and verifies the submitted password against its stored password hash.
3. On successful authentication, the backend establishes a secure session or issues an appropriately protected authentication token.
4. Protected API endpoints identify the authenticated user before returning private profile or booking data.
5. Authorization rules restrict administrative operations, such as changing station records, to users with the required role.

Authentication answers **“Who is the user?”** Authorization answers **“What is this user allowed to do?”** Passwords and privileged operations must be handled on the backend, not trusted to frontend-only checks.

### 3. Vehicle profile and charging preferences

After registration, the user selects their EV brand and model and can set preferences such as preferred charging speed, price range, search radius, and charging priority.

The backend stores the vehicle in a `vehicles` table linked to the account through `user_id`. Vehicle specifications—such as supported AC/DC charging modes, connector types, battery capacity, and maximum supported charging power—should be represented in a separate vehicle-model data structure where possible. User preferences belong in a related `charging_preferences` table rather than being mixed with technical vehicle specifications.

This separation lets one user maintain multiple vehicles and lets many users reference the same vehicle model without duplicating its technical specifications.

### 4. Compatible station discovery

When the user opens the station discovery page, the frontend requests station data from the backend using the selected vehicle and search filters.

The backend queries PostgreSQL to compare vehicle compatibility with station charger attributes. It can join vehicle-model and connector records with station and charger records, then filter by connector compatibility, charging mode, supported power, location, price, and recorded station information. Results can be ranked according to the user's saved preferences.

The frontend displays the resulting compatible stations. A charger should not be described as live-available unless a reliable data source provides that status; database booking availability and real-world connector occupancy are separate concepts.

### 5. Time-slot availability and booking

1. The user selects a compatible station, a specific charger, a date, a start time, and a requested duration.
2. The backend checks that the requested interval falls within the station's operating hours and does not overlap a conflicting confirmed booking for the same charger.
3. The backend creates the booking inside a PostgreSQL transaction and uses suitable database constraints or locking to prevent two concurrent requests from reserving the same charger and time.
4. If the reservation succeeds, the backend returns a confirmation and the frontend displays it. If the slot is no longer available, the user is asked to select another time.
5. The booking is linked to both the user and the charger through foreign keys. Users can retrieve or cancel their own bookings according to the booking rules.

The planned `bookings` table will hold fields such as `booking_id`, `user_id`, `charger_id`, `start_time`, `end_time`, `status`, and timestamps. PostgreSQL constraints and transaction handling will protect referential integrity and booking consistency. A reservation system can determine occupancy from its own bookings; actual physical charger occupancy requires reliable live station or operator data.

### 6. Personalized dashboard

After login, the dashboard requests the user's saved profile, vehicles, preferences, compatible station results, and upcoming bookings from backend endpoints. The backend retrieves each set of records from PostgreSQL using the authenticated user's identifier. The frontend presents the data without directly connecting to the database.

### Planned relational entities

| Table / entity | Responsibility |
|---|---|
| `users` | Account identity and password hash |
| `roles` and `user_roles` | Authorization roles assigned to users |
| `vehicles` | Vehicles registered by a user |
| `vehicle_models` | Reusable vehicle specifications by brand and model |
| `vehicle_connectors` | Connector types supported by a vehicle model |
| `charging_preferences` | User-selected price, speed, distance, and ranking preferences |
| `stations` | Station location, operator, hours, and available station details |
| `chargers` | Individual charger power and charging attributes |
| `charger_connectors` | Connector types provided by each charger |
| `bookings` | User reservations, charger, time interval, and status |

These are proposed entities rather than a claim that the final schema is already deployed. Table names, columns, and relationships will be aligned with the implemented ER diagram and SQL schema.

### Intended application architecture

```text
React + TypeScript frontend
          |
          | HTTPS API requests
          v
Backend API
(validation, authentication, authorization,
compatibility checks, booking logic)
          |
          | SQL queries / transactions
          v
PostgreSQL database
(users, vehicles, stations, chargers, bookings)
```

The frontend will communicate with PostgreSQL through the backend API rather than connecting directly to the database. Database credentials will remain on the server side and will not be exposed in frontend code.

## Team Members

| Name | PRN / Roll Number |
|---|---|
| Monish Jain | 1262241544 |
| Kabeer Barot | 1262241539 |

## Project Goal

EVConnect aims to make EV charging information easier to explore and use in the Indian context. By combining a user-facing station discovery experience with a relational database, the project brings together application development and core DBMS concepts such as relational modelling, data integrity, structured queries, and connected application data.

## Repository

[GitHub Repository](https://github.com/Kabeer-ui/EVConnect)
