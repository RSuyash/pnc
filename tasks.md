# Prithvi Nature Club (PNC) Digital Platform - Comprehensive Task List

This document provides a detailed, hierarchical breakdown of all tasks required to complete the PNC Digital Platform as specified in the SRS document `PNC-SRS-DOC-13-10-25-001.md`.

## Phase 0: Project Setup, Planning, and Foundation

### 1. Project Management & Documentation
- [ ] 1.1. Initialize Git repository on a platform like GitHub or GitLab.
- [ ] 1.2. Create main branches (`main`, `develop`).
- [ ] 1.3. Establish branch protection rules for `main`.
- [ ] 1.4. Create `README.md` with project overview, setup instructions, and contribution guidelines.
- [ ] 1.5. Create `.gitignore` files for both frontend and backend to exclude `node_modules`, `__pycache__`, `.env` files, etc.
- [ ] 1.6. Set up project management board (e.g., Jira, Trello, GitHub Projects).
- [ ] 1.7. Populate project board with these tasks.
- [ ] 1.8. Create a `docs` folder for all technical and user documentation.
- [ ] 1.9. Draft initial architecture diagrams (C4 model or similar).
- [ ] 1.10. Define the "Code & Document" policy and add it to `CONTRIBUTING.md`.

### 2. Backend (Django) Initial Setup
- [ ] 2.1. Create a new Django project (`pnc_project`).
- [ ] 2.2. Create the first Django app (`core` or `api`).
- [ ] 2.3. Configure `settings.py` for development and production environments (using `python-decouple` or similar).
- [ ] 2.4. Set up PostgreSQL database connection.
- [ ] 2.5. Install and configure Django REST Framework (`djangorestframework`).
- [ ] 2.6. Install and configure CORS headers (`django-cors-headers`).
- [ ] 2.7. Set up token-based authentication (e.g., `djangorestframework-simplejwt`).
- [ ] 2.8. Set up linter (e.g., `flake8`, `black`) and formatter (`black`).
- [ ] 2.9. Configure testing framework (`pytest-django`).
- [ ] 2.10. Create initial `requirements.txt` file.
- [ ] 2.11. Set up environment management (e.g., `venv`, `pipenv`).
- [ ] 2.12. Create a custom User model inheriting from `AbstractUser` to facilitate future profile changes.

### 3. Frontend (Next.js) Initial Setup
- [ ] 3.1. Initialize a new Next.js project (`npx create-next-app`).
- [ ] 3.2. Choose TypeScript during setup.
- [ ] 3.3. Set up folder structure (e.g., `components`, `pages`, `styles`, `lib`, `hooks`).
- [ ] 3.4. Install and configure ESLint and Prettier for code quality and consistency.
- [ ] 3.5. Install a CSS framework or library for styling (e.g., Tailwind CSS, Styled-components).
- [ ] 3.6. Set up environment variables (`.env.local`) for API base URL.
- [ ] 3.7. Install `axios` or configure `fetch` for API calls.
- [ ] 3.8. Create a global theme file to manage "Eco-Modern" design tokens (colors, fonts, spacing).
- [ ] 3.9. Configure testing framework (e.g., Jest, React Testing Library).
- [ ] 3.10. Add initial font files (Sans-serif and Serif) as per UI-2.

### 4. Deployment & DevOps (Initial)
- [ ] 4.1. Choose cloud providers (Vercel for Frontend, DigitalOcean/AWS for Backend).
- [ ] 4.2. Set up a basic CI/CD pipeline for the backend (e.g., GitHub Actions) to run tests on push.
- [ ] 4.3. Set up a basic CI/CD pipeline for the frontend (e.g., Vercel's Git integration) to deploy on push to `develop`.
- [ ] 4.4. Configure a monitoring service for uptime tracking (e.g., UptimeRobot, Better Uptime).

## Phase 1: Core Features - Public Website & User Authentication

### 5. User Authentication & Profiles (F-2.1)
- [ ] 5.1. **Backend:**
    - [ ] 5.1.1. Create `users` app in Django.
    - [ ] 5.1.2. Define `UserProfile` model with fields for skills matrix, project history, contact info, and PNC Credit balance. Link it one-to-one with the custom User model.
    - [ ] 5.1.3. Create API endpoint for user registration. It should set new users to `is_active=False` by default.
    - [ ] 5.1.4. Create API endpoint for user login that returns JWT tokens.
    - [ ] 5.1.5. Create API endpoint for fetching the user's own profile (`/api/users/me/`).
    - [ ] 5.1.6. Create admin-only API endpoint to list all users.
    - [ ] 5.1.7. Create admin-only API endpoint to approve a user registration (sets `is_active=True`).
    - [ ] 5.1.8. Create admin-only API endpoint to update user roles (e.g., Member, EC, Admin).
    - [ ] 5.1.9. Write unit tests for all authentication and profile endpoints.
    - [ ] 5.1.10. Integrate `UserProfile` into the Django Admin panel.
- [ ] 5.2. **Frontend:**
    - [ ] 5.2.1. Create a `LoginPage` component.
    - [ ] 5.2.2. Create a `RegistrationPage` component with a form.
    - [ ] 5.2.3. Implement form validation for login and registration.
    - [ ] 5.2.4. Implement logic to call the registration API.
    - [ ] 5.2.5. Implement logic to call the login API and store JWT tokens securely (e.g., in httpOnly cookies or local storage).
    - [ ] 5.2.6. Create a global authentication context/provider to manage user state throughout the app.
    - [ ] 5.2.7. Create protected routes that redirect unauthenticated users to the login page.
    - [ ] 5.2.8. Create a `UserProfilePage` to display the logged-in user's details.
    - [ ] 5.2.9. Implement logic to fetch and display profile data from the `/api/users/me/` endpoint.
    - [ ] 5.2.10. Create an `Admin/Members` page to list and approve new users.
    - [ ] 5.2.11. Write component tests for Login, Registration, and Profile pages.

### 6. Public-Facing Website - Homepage (F-1.1)
- [ ] 6.1. **Backend:**
    - [ ] 6.1.1. Create a `website` app in Django.
    - [ ] 6.1.2. Create a `HomePageContent` model to store editable text (mission, stats), video URLs, and partner logos.
    - [ ] 6.1.3. Create an API endpoint to fetch all homepage content.
    - [ ] 6.1.4. Integrate `HomePageContent` model into the Django Admin panel.
- [ ] 6.2. **Frontend:**
    - [ ] 6.2.1. Create `Hero` component (FR-1.1.1).
        - [ ] 6.2.1.1. Implement full-screen cinematic video background.
        - [ ] 6.2.1.2. Add overlay for headline and key impact statistics.
        - [ ] 6.2.1.3. Fetch and display dynamic content from the API.
        - [ ] 6.2.1.4. Ensure responsive design for the hero section.
    - [ ] 6.2.2. Create `ProjectShowcase` component (FR-1.1.2).
        - [ ] 6.2.2.1. Create `ProjectCard` sub-component.
        - [ ] 6.2.2.2. Fetch and display 3-4 flagship projects (initially hardcoded, later dynamic).
        - [ ] 6.2.2.3. Style the section and cards.
    - [ ] 6.2.3. Create `ProofBar` component (FR-1.1.3).
        - [ ] 6.2.3.1. Implement a carousel for partner logos.
        - [ ] 6.2.3.2. Implement a rotating banner for testimonials.
        - [ ] 6.2.3.3. Fetch logos and testimonials from the API.
    - [ ] 6.2.4. Create `GetInvolved` component (FR-1.1.4).
        - [ ] 6.2.4.1. Design two distinct CTA sections ("Join" and "Partner").
        - [ ] 6.2.4.2. Link "Join" to the registration page and "Partner" to the sponsorship page.
    - [ ] 6.2.5. Create `ProfessionalShowcase` component (FR-1.1.5).
        - [ ] 6.2.5.1. Implement a gallery for high-quality photos.
        - [ ] 6.2.5.2. Fetch images and captions from the API.
    - [ ] 6.2.6. Assemble all components into the main `HomePage`.
    - [ ] 6.2.7. Implement overall page layout including Header and Footer.
    - [ ] 6.2.8. Ensure the entire page is responsive (UI-1).
    - [ ] 6.2.9. Adhere to "Eco-Modern" design philosophy (UI-2).

### 7. Public-Facing Website - Project Pages (F-1.2)
- [ ] 7.1. **Backend:**
    - [ ] 7.1.1. Create a `projects` app in Django.
    - [ ] 7.1.2. Define `Project` model with fields for title, description, report, data, status, images, videos.
    - [ ] 7.1.3. Define `ProjectImage` and `ProjectVideo` models with foreign keys to `Project`.
    - [ ] 7.1.4. Create API endpoint to list all projects (`/api/projects/`).
    - [ ] 7.1.5. Implement filtering capabilities on the list endpoint (e.g., by category, year).
    - [ ] 7.1.6. Create API endpoint to retrieve a single project by slug or ID (`/api/projects/<slug>/`).
    - [ ] 7.1.7. Integrate `Project` models into the Django Admin panel for CRUD operations.
    - [ ] 7.1.8. Write unit tests for all project endpoints.
- [ ] 7.2. **Frontend:**
    - [ ] 7.2.1. Create `OurProjectsPage` (FR-1.2.1).
        - [ ] 7.2.1.1. Fetch and display a gallery of all projects.
        - [ ] 7.2.1.2. Implement client-side UI for filtering projects.
        - [ ] 7.2.1.3. Ensure each project card links to its detailed page.
    - [ ] 7.2.2. Create dynamic route for individual project pages `pages/projects/[slug].js` (FR-1.2.2).
    - [ ] 7.2.3. On the project detail page, fetch data using `getStaticProps` with `getStaticPaths` for performance.
    - [ ] 7.2.4. Display comprehensive project report, data, and galleries.
    - [ ] 7.2.5. Implement a photo/video gallery viewer (e.g., with a lightbox).
    - [ ] 7.2.6. Add the "Fund This Project" button.
    - [ ] 7.2.7. Ensure project pages are responsive.

### 8. Public-Facing Website - Funding & Sponsorship (F-1.3)
- [ ] 8.1. **Backend:**
    - [ ] 8.1.1. Create a `sponsorship` app.
    - [ ] 8.1.2. Create a `SponsorshipInquiry` model with fields for name, email, organization, message.
    - [ ] 8.1.3. Create an API endpoint to receive and save sponsorship inquiries.
    - [ ] 8.1.4. Configure email notifications to the EC upon new inquiry submission.
    - [ ] 8.1.5. Integrate `SponsorshipInquiry` model into the Django Admin panel.
- [ ] 8.2. **Frontend:**
    - [ ] 8.2.1. Create `SponsorUsPage` (FR-1.3.1).
    - [ ] 8.2.2. Add content explaining funding opportunities.
    - [ ] 8.2.3. Create a `SponsorshipInquiryForm` component (FR-1.3.2).
    - [ ] 8.2.4. Implement form validation and submission to the API.
    - [ ] 8.2.5. Display a success message after form submission.
    - [ ] 8.2.6. Ensure the "Fund This Project" button on project pages links to the relevant section or form on this page.

## Phase 2: Internal Management Portal

### 9. Member Dashboard (F-2.2)
- [ ] 9.1. **Backend:**
    - [ ] 9.1.1. Create a single API endpoint (`/api/dashboard/`) that aggregates data for the logged-in user.
    - [ ] 9.1.2. This endpoint should gather: assigned tasks, recent announcements, team activity, upcoming events.
- [ ] 9.2. **Frontend:**
    - [ ] 9.2.1. Create `DashboardPage` as the main landing page for logged-in users.
    - [ ] 9.2.2. Design a modular grid layout (FR-2.2.1).
    - [ ] 9.2.3. Create `MyTasksWidget` component.
    - [ ] 9.2.4. Create `AnnouncementsWidget` component.
    - [ ] 9.2.5. Create `TeamActivityWidget` component.
    - [ ] 9.2.6. Create `UpcomingEventsWidget` component.
    - [ ] 9.2.7. Create `QuickProfileWidget` component.
    - [ ] 9.2.8. Fetch all data from the `/api/dashboard/` endpoint in the parent `DashboardPage`.
    - [ ] 9.2.9. Pass down props to each widget.
    - [ ] 9.2.10. Ensure the dashboard is responsive.

### 10. Task Management System (F-2.3)
- [ ] 10.1. **Backend:**
    - [ ] 10.1.1. Create a `tasks` app.
    - [ ] 10.1.2. Define `Task` model with fields: title, description, deadline, status (`ForeignKey` to a `TaskStatus` model), assigned users (`ManyToManyField` to User).
    - [ ] 10.1.3. Define `TaskStatus` model with statuses: 'To-Do', 'In Progress', 'Done'.
    - [ ] 10.1.4. Create admin-only API endpoint for creating tasks and assigning them.
    - [ ] 10.1.5. Create API endpoint for users to view tasks assigned to them.
    - [ ] 10.1.6. Create API endpoint for users to update the status of their tasks.
    - [ ] 10.1.7. Create admin-only API endpoint for updating/deleting any task.
    - [ ] 10.1.8. Integrate `Task` model into the Django Admin panel.
    - [ ] 10.1.9. Write unit tests for all task management endpoints.
- [ ] 10.2. **Frontend:**
    - [ ] 10.2.1. Create `Admin/Tasks` page for EC to manage tasks.
    - [ ] 10.2.2. Implement a form to create a new task, including assigning users and setting deadlines.
    - [ ] 10.2.3. Display a list or board of all tasks with status and assignee.
    - [ ] 10.2.4. On the member dashboard, the `MyTasksWidget` should list tasks assigned to the logged-in user (FR-2.3.2).
    - [ ] 10.2.5. Allow users to change the status of their tasks (e.g., via a dropdown).
    - [ ] 10.2.6. Implement UI to reflect task status changes immediately.

## Phase 3: Gamification System

### 11. Credit Earning & Verification (F-3.1)
- [ ] 11.1. **Backend:**
    - [ ] 11.1.1. Create a `gamification` app.
    - [ ] 11.1.2. Define `Activity` model to store predefined activities and their credit values (from Appendix B).
    - [ ] 11.1.3. Define `CreditClaim` model: `ForeignKey` to User, `ForeignKey` to Activity, details/proof text field, status ('Pending', 'Approved', 'Denied'), reason for denial.
    - [ ] 11.1.4. Create API endpoint for members to submit a `CreditClaim` (FR-3.1.1).
    - [ ] 11.1.5. Create admin-only API endpoint to view a queue of 'Pending' claims (FR-3.1.2).
    - [ ] 11.1.6. Create admin-only API endpoint to approve or deny a claim (FR-3.1.3).
    - [ ] 11.1.7. Implement the logic to atomically add credits to `UserProfile.pnc_credit_balance` upon approval.
    - [ ] 11.1.8. Integrate `Activity` and `CreditClaim` models into the Django Admin panel.
    - [ ] 11.1.9. Write unit tests for the credit claim and approval process.
- [ ] 11.2. **Frontend:**
    - [ ] 11.2.1. Create `CreditClaimPage` in the member portal.
    - [ ] 11.2.2. Create a form for submitting a credit claim, with a dropdown of predefined activities.
    - [ ] 11.2.3. Create a `MyClaimsHistory` page/tab for members to see the status of their past claims.
    - [ ] 11.2.4. Create `Admin/PendingClaims` page for the Secretary.
    - [ ] 11.2.5. Display a queue of pending claims with all necessary details.
    - [ ] 11.2.6. Implement UI for admins to approve or deny claims, including a text field for the reason of denial.
    - [ ] 11.2.7. The user's credit balance on their profile and dashboard should update automatically.

### 12. Rewards System (F-3.2)
- [ ] 12.1. **Backend:**
    - [ ] 12.1.1. Define `Reward` model: name, description, credit cost, stock level.
    - [ ] 12.1.2. Define `RewardRedemption` model: `ForeignKey` to User, `ForeignKey` to Reward, timestamp.
    - [ ] 12.1.3. Create API endpoint for members to view available rewards.
    - [ ] 12.1.4. Create API endpoint for members to redeem a reward.
    - [ ] 12.1.5. Implement logic to check if the user has enough credits and if the reward is in stock.
    - [ ] 12.1.6. Implement logic to atomically subtract credits from the user's balance and decrement reward stock.
    - [ ] 12.1.7. Integrate `Reward` and `RewardRedemption` models into the Django Admin panel.
    - [ ] 12.1.8. Write unit tests for the reward redemption process.
- [ ] 12.2. **Frontend:**
    - [ ] 12.2.1. Create `RewardsStorePage` in the member portal (FR-3.2.1).
    - [ ] 12.2.2. Fetch and display available rewards with their costs.
    - [ ] 12.2.3. Implement a "Redeem" button for each reward.
    - [ ] 12.2.4. Add a confirmation modal before redeeming.
    - [ ] 12.2.5. Disable redeem button if user has insufficient credits or reward is out of stock.
    - [ ] 12.2.6. Create a `MyRewardsHistory` page/tab for members to see what they've redeemed.
    - [ ] 12.2.7. Create `Admin/ManageRewards` page to add/edit rewards.

## Phase 4: Non-Functional Requirements & Launch

### 13. Performance (NFR-1)
- [ ] 13.1. **Frontend:**
    - [ ] 13.1.1. Optimize all images (compression, modern formats like WebP).
    - [ ] 13.1.2. Use Next.js `Image` component.
    - [ ] 13.1.3. Implement code splitting for large components.
    - [ ] 13.1.4. Use `getStaticProps` for public pages where possible.
    - [ ] 13.1.5. Minify CSS and JavaScript (handled by Next.js build).
    - [ ] 13.1.6. Run Google Lighthouse audits and address identified issues.
    - [ ] 13.1.7. Analyze and optimize Core Web Vitals (LCP, FID, CLS).
- [ ] 13.2. **Backend:**
    - [ ] 13.2.1. Optimize database queries (use `select_related` and `prefetch_related`).
    - [ ] 13.2.2. Implement caching for frequently accessed, non-dynamic data (e.g., homepage content).
    - [ ] 13.2.3. Use a production-ready web server (e.g., Gunicorn) behind a reverse proxy (e.g., Nginx).

### 14. Security (NFR-2)
- [ ] 14.1. Enforce HTTPS across the entire platform.
- [ ] 14.2. Ensure all passwords are hashed and salted (handled by Django).
- [ ] 14.3. Protect against SQL injection (handled by Django ORM).
- [ ] 14.4. Protect against XSS (sanitize user-generated content).
- [ ] 14.5. Protect against CSRF (handled by Django, verify for APIs).
- [ ] 14.6. Configure security headers (e.g., `Content-Security-Policy`).
- [ ] 14.7. Perform a security audit/scan before launch.
- [ ] 14.8. Ensure JWT tokens have a reasonable expiration time and are handled securely.

### 15. Reliability & Maintainability (NFR-3, NFR-4)
- [ ] 15.1. Finalize production deployment configurations.
- [ ] 15.2. Set up database backups.
- [ ] 15.3. Confirm uptime monitoring is active and configured to send alerts.
- [ ] 15.4. Review all code for comments and clarity.
- [ ] 15.5. Write comprehensive documentation for setting up the development environment.
- [ ] 15.6. Write user guides for Members and the Executive Committee.
- [ ] 15.7. Create a handover document ("Head of Technology" guide) explaining the architecture, deployment, and maintenance procedures.

### 16. Accessibility (UI-4)
- [ ] 16.1. Ensure semantic HTML is used throughout the site.
- [ ] 16.2. Add `alt` text to all meaningful images.
- [ ] 16.3. Ensure sufficient color contrast.
- [ ] 16.4. Ensure all interactive elements are keyboard-navigable.
- [ ] 16.5. Use ARIA attributes where necessary.
- [ ] 16.6. Run an accessibility audit (e.g., using Axe tools).

### 17. Final Launch
- [ ] 17.1. Final round of end-to-end testing by the EC.
- [ ] 17.2. Migrate production database.
- [ ] 17.3. Point domain names to the production servers.
- [ ] 17.4. Announce launch.
- [ ] 17.5. Monitor system closely for any initial issues.
