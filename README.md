This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Before Start

You must place an dotenv(.env.local) file at the root of your project.
And this dotenv must contain the following environment variables.

```dotenv
STACKOVERFLOW_API_URL=https://api.stackexchange.com
# Applications should be registered on Stack Apps to get a request key.
STACKOVERFLOW_KEY=GRANT_YOUR_OWN_KEY
```

## Install node_modules

```bash
yarn install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
