# Token Management System

Web application to manage service tokens, built with Angular for the frontend.

## Live demo

**https://marthajcaro.github.io/token-management/**

Sign in with `martha@coro.com` / `123456` (admin) to explore every role.

| Piece | Service | URL |
| --- | --- | --- |
| Frontend | GitHub Pages | https://marthajcaro.github.io/token-management/ |
| API | Render | https://token-management-api.onrender.com/api |
| API docs | Render (Swagger) | https://token-management-api.onrender.com/api-docs/ |
| Database | Neon (PostgreSQL) | managed, no public URL |

The API runs on Render's free tier, so it sleeps after 15 minutes of
inactivity and needs about 30 seconds to wake up on the next request.

## Features
- Token management per user and service
- Login with role-based access (admin, editor, reader)
- Reactive forms with validation
- JWT authentication
- REST API integration

## Technologies
- Angular 18
- TypeScript
- HTML5
- Bootstrap 5
- Jest

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MarthajCaro/token-management.git
cd token-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open in the browser:
```
http://localhost:4200/
```

## Tests

```bash
npm test
```

## Configuration

The API base URL lives in `src/environments/environment.ts` for local
development, and `src/environments/environment.prod.ts` for production.
Angular swaps them at build time through `fileReplacements` in
`angular.json`, so the deployed bundle never points at `localhost`.

There are no credentials in this repository: the frontend never holds a
client secret and only stores the JWT returned by the API.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
app and publishes it to the `gh-pages` branch of this repository.

## Backend

Locally this app needs the API running on `http://localhost:3000`.
In production it points at the deployed API.

https://github.com/MarthajCaro/token-management-api

## Author
Martha Caro – Junior Full Stack Developer