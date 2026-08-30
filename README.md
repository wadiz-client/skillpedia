<!-- This file is a translation of README.ko.md (source of truth). -->

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/images/hero_dark.jpg" />
  <img alt="Skillpedia hero" src="./public/images/hero_light.jpg" width="100%" />
</picture>

# Skillpedia

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

</div>

## Overview

Skillpedia reads skill documents authored by engineers so that both people and AI agents can find the exact, verified usage instructions for a tool. It fetches `SKILL.md` files from a curated list of GitHub repositories through the GitHub App API and renders them as structured pages.

> "For an AI agent to use a tool correctly, it needs a verified guide written by an engineer. Skillpedia is the most efficient channel for delivering that guide."

## Tech stack

| Category             | Technology           |
| -------------------- | -------------------- |
| Language             | TypeScript           |
| Framework            | Next.js (App Router) |
| UI library           | GitHub Primer        |
| Styling              | CSS Modules (SCSS)   |
| Internationalization | next-intl            |
| API client           | Octokit (GitHub App) |

## Project structure

Skillpedia follows the Feature-Sliced Design (FSD) architecture for scalability and maintainability. It uses a `views` layer to avoid conflicts with the Next.js App Router.

UI and logic used by a single page live inside that view slice under `_ui` and `_lib` folders.

```text
src/
├── app/        # App config, providers, global styles, layout, routes
├── views/      # Page-level composition and page-only UI/logic
│               #   (HomePage, OwnerRepoSlugPage + _ui: Article·Prose·CodeBlock·Sidebar·Toc, _lib: parseMarkdown, etc.)
├── widgets/    # Global layout blocks (Layout, Header, Content)
├── features/   # User interaction features (repository-markdown, repository-metadata, repository-tree)
└── shared/     # Shared API clients, styles, i18n (github, breakpoint)
```

Define the list of source repositories in `repositories.yaml`. In production, inject the list through the `REPOSITORIES` GitHub Actions variable.

## Getting started

For more information, see [Installing on your own infrastructure](./INSTALLATION.md).

### Prerequisites

Install the Node.js version pinned in `.nvmrc`.

```shell
nvm install
```

### Install dependencies

```shell
npm install
```

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in the GitHub App credentials.

```properties
APP_ID=
APP_PRIVATE_KEY=
```

### Run

```shell
npm run dev
```

The app runs at `http://localhost:3000`.

## Build

```shell
npm run build
```
