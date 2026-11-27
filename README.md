# Kafabih — Personal Portfolio

A personal portfolio website built to showcase my background, mindset, skills, and selected projects as a Software Engineering graduate.

Designed with a dark Monokai-inspired theme, subtle animations, and a minimal interface that reflects my curiosity and approach to building things.

## Overview

This portfolio is more than a collection of projects. It is a space to introduce myself, share how I approach problems, and showcase the things I have explored and built.

**Live Website:** [Add your portfolio URL here]

## Features

- **Personal Introduction** — A brief introduction and overview of my background.
- **About Me** — An interactive section highlighting the principles behind how I think, learn, and create.
- **Skills** — A showcase of technologies and tools I have worked with.
- **Projects** — A collection of selected projects and experiments.
- **Contact** — Direct access to my email, GitHub, LinkedIn, and resume.
- **Responsive Design** — Layouts designed for desktop and mobile screens.
- **Motion Animations** — Subtle transitions and interactive elements for a more engaging experience.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework and application structure |
| [React](https://react.dev/) | UI development |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS](https://tailwindcss.com/) | Styling and responsive layouts |
| [Motion](https://motion.dev/) | Animations and interactive transitions |
| [React Icons](https://react-icons.github.io/react-icons/) | Platform and technology icons |
| [Lucide](https://lucide.dev/) | Interface icons |

## Design

The website uses a dark color palette inspired by Monokai, with green as its primary accent color.

The design focuses on:

- Minimalist layouts and clear visual hierarchy.
- Consistent typography and spacing.
- Subtle animations rather than excessive visual effects.
- A cohesive visual identity across all sections.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repository
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── navbar.tsx
│   ├── hero.tsx
│   ├── about.tsx
│   ├── skills.tsx
│   ├── projects.tsx
│   └── contact.tsx
│
├── public/
│   └── cv.pdf
│
├── package.json
└── README.md
```

## Customization

Some personal information is configured directly in the Contact component:

- Email address
- GitHub profile
- LinkedIn profile
- Resume file

Place your resume inside the `public` directory and update its path in the component.

## Deployment

This project can be deployed using [Vercel](https://vercel.com/), the platform built by the creators of Next.js.

Connect your GitHub repository to Vercel and follow the deployment instructions.

## License

This project is intended as a personal portfolio. Feel free to use it as inspiration for your own portfolio, but please replace personal information, content, and branding with your own.

---

**Built with curiosity and a little bit of code.**
