# EVConnect

EVConnect is a web application prototype focused on helping electric-vehicle (EV) users discover charging stations and explore station information. The project is being developed as part of a DBMS project, with an emphasis on connecting the application to a structured database.

> **Project status:** The frontend prototype is available. PostgreSQL integration and CSV data integration are being handled separately and should be considered in progress until verified in the running application.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Routing:** React Router
- **Styling/UI:** Project frontend styles and components
- **Database:** PostgreSQL (managed through pgAdmin during development)
- **Data/API integration:** Planned backend/API connection between the frontend and PostgreSQL
- **Version control:** Git and GitHub

## Team Members

| Name | PRN / Roll Number |
|---|---|
| Monish Jain | 1262241544 |
| Kabeer Barot | 1262241539 |

## Current Prototype Scope

The frontend includes pages and flows for exploring charging stations, viewing station details, booking demonstrations, viewing bookings, using an assistant interface, viewing impact information, and managing a profile.

Some current prototype services use mock/sample data and browser local storage. Booking flows should therefore be treated as demonstrations rather than confirmed real-world charging reservations unless and until a live backend is connected.

## Database

The project uses **PostgreSQL** as its intended relational database. The database schema and data integration are being developed separately. The repository documentation will be updated with the final schema, ER diagram, and database workflow once these are finalized.

## Setup and Execution

### Prerequisites

- Node.js and npm
- Git

### Run the frontend locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Kabeer-ui/EVConnect.git
   cd EVConnect
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure any environment variables required by the project in a local environment file, following the variable names used by the application. Do not commit API keys, database passwords, or other secrets.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal by Vite.

### PostgreSQL

PostgreSQL is part of the project’s database work, but the frontend setup above does not by itself configure or connect a database. Database setup, schema creation, CSV import, and backend connection instructions will be added after the team finalizes and verifies the integration.

## User Workflow

The user workflow will be documented here after the team finalizes the intended steps. It will distinguish between functionality currently available in the prototype and functionality that depends on the PostgreSQL-backed integration.

## Project Repository

- GitHub: https://github.com/Kabeer-ui/EVConnect

## Development Notes

- Keep database credentials and API keys out of source control.
- Make focused, meaningful commits as features and documentation are completed.
- Update this README when the database integration and user workflow have been tested so that it reflects the actual state of the project.
