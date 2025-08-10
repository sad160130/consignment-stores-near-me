# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.6 project with TypeScript, using the App Router architecture. The project is bootstrapped with `create-next-app` and uses Tailwind CSS v4 for styling with modern CSS features.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

The development server runs on http://localhost:3000.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono via next/font/google
- **Linting**: ESLint with Next.js and TypeScript configurations

### Project Structure

```
app/
├── layout.tsx          # Root layout with font configuration
├── page.tsx           # Home page component
├── globals.css        # Global styles with CSS variables
└── favicon.ico

public/                # Static assets (SVG icons)
```

### Key Technical Details

- Uses CSS variables for theming with automatic dark mode detection
- TypeScript path mapping configured with `@/*` pointing to project root
- Next.js Image optimization for all images
- ESLint extends `next/core-web-vitals` and `next/typescript` configurations

## Styling System

The project uses Tailwind CSS v4 with a custom theme configuration:
- CSS variables for background/foreground colors
- Automatic dark/light theme switching based on system preference
- Custom font variables integrated into Tailwind theme
- Modern CSS features via `@theme inline` directive