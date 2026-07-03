# Team 3291 - The Golden Pirates

Welcome aboard! 🏴‍☠️

This repository contains the source code for the official website of FRC Team 3291, **The Golden Pirates**, and their FTC subteams.

## Ahoy!

Feel free to use this project as inspiration or a learning resource. If you decide to borrow code or ideas, we kindly ask that you:
- Credit Team 3291.
- Don't present this project as entirely your own work.
- Replace all Team 3291 branding, logos, images, and other team-specific content before publishing your own version.

Fair winds and happy coding! ⚓

## Quick Start

```bash
git clone <repository-url>
cd <repository-name>

npm install

# Create your environment file
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the server
npm start
```

## Notes

### Project Structure

```
.
├── public/             # Static frontend files (HTML, CSS, JS, images, models)
├── routes/             # Express API routes
├── prisma/             # Prisma schema and migrations
├── uploads/            # Uploaded files (if enabled)
├── .env.example        # Example environment variables
├── .env               # Your local environment variables (create from .env.example)
├── server.js          # Main Express server
└── package.json       # Project configuration and dependencies
```

### Environment Variables

Before starting the project, copy the example environment file:

```bash
cp .env.example .env
```

(or manually create `.env` from `.env.example` on Windows.)

Fill in the required values before running the server.

### API Routes

All backend API endpoints are located in the `routes/` directory.

For example:

```
routes/
├── robots.js      # /api/robots
├── auth.js        # /api/auth
├── users.js       # /api/users
└── ...
```

Routes are mounted in `server.js` and are available under the `/api/` prefix unless otherwise specified.

### Database

The project uses **Prisma** as its ORM.

- Prisma schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`

After editing the schema, run:

```bash
npx prisma migrate dev
```

### Static Assets

- Images: `public/images/`
- CSS: `public/css/`
- JavaScript: `public/js/`
- 3D Models: `public/models/`

### Configuration

If you're customizing the website for another robotics team, remember to replace:

- Team name
- Logos
- Images
- Robot information
- Social media links
- Sponsors
- Colors (optional)