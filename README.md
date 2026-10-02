# Token Management System

Web application to manage service tokens, built with Angular for the frontend.

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

The API base URL lives in `src/environments/environment.ts`. There are no
credentials in this repository: the frontend never holds a client secret.

## Backend

This app needs the API running on `http://localhost:3000`.

https://github.com/MarthajCaro/token-management-api

## Author
Martha Caro – Junior Full Stack Developer