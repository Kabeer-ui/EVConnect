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

## Team Members

| Name | PRN / Roll Number |
|---|---|
| Monish Jain | 1262241544 |
| Kabeer Barot | 1262241539 |

## Project Goal

EVConnect aims to make EV charging information easier to explore and use in the Indian context. By combining a user-facing station discovery experience with a relational database, the project brings together application development and core DBMS concepts such as relational modelling, data integrity, structured queries, and connected application data.

## Repository

[GitHub Repository](https://github.com/Kabeer-ui/EVConnect)
