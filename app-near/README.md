# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## How do I init env locally?

Use correct node version:
```
nvm use
```

Install dependencies:
```
npm install
```

Configure husky pre commit:
```
npm run prepare
```

Run local postgresql:
```
docker-compose up -d
```

Create empty env file:
```
cp .env.example .env
```

Customize it in particular generate AUTH_SECRET with:
```
openssl rand -base64 32
```

Migrate database:
```
npm run db:push
```

Run app locally:
```
npm run dev
```


# How to load insee iris population data and init a survey ? 

## 1 Download insee population data file

For 2021
```
curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip && unzip base-ic-evol-struct-pop-2021_csv.zip && mv base-ic-evol-struct-pop-2021.CSV ./scripts/base-ic-evol-struct-pop-2021.csv
```

## 2 Load insee data and init survey

Work only if you followed step 1

```
npm run load:all
```

It's also possible to break it into 2 steps : 

## 2.1 Load insee data into a Postgresql database

```
npm run load:insee -- "$(pwd)/scripts/base-ic-evol-struct-pop-2021.csv" postgresql://postgres:password@localhost:5432/app-near
```

It also work without parameters on local if you follow step 1

## 2.2 Init a surveys into db and create postgresql stats view

It will use .env environment variables
```
npm run load-surveys
```