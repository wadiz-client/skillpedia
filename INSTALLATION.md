<!-- This file is a translation of INSTALLATION.ko.md (source of truth). -->

# Installing on your own infrastructure

This document covers the steps to serve `SKILL.md` files from private repositories to people in your organization. For local development setup, see the [README](./README.md).

## Prerequisites

Prepare the following before you start.

- The Node.js version pinned in `.nvmrc`, and nvm
- Permission to create a GitHub App in your organization and install it on repositories
- An internal server with a self-hosted runner registered

## Create a GitHub App

Skillpedia reads `SKILL.md` files from repositories with GitHub App permissions.

### Create the app

Create the app on the app creation page. Use `https://github.com/settings/apps/new` for a personal account and `https://github.com/organizations/{organization}/settings/apps/new` for an organization account.

- Enter a name that is easy to identify within the organization in **GitHub App name**.
- Enter the deployment URL in **Homepage URL**. Before deployment, the repository URL works as well.
- Clear the **Active** checkbox under **Webhook**. Skillpedia does not use webhooks.

### Set permissions

Under **Repository permissions**, set the following two permissions to **Read-only**.

| Permission | Purpose                                                   |
| ---------- | --------------------------------------------------------- |
| Contents   | Reads `SKILL.md` files and document files in repositories |
| Metadata   | Reads repository details and app installation details     |

### Generate a private key

On the app settings page, click **Generate a private key** under **Private keys** to download the `.pem` file. You cannot download the key again, so store it in a safe place.

### Install the app

In **Install App**, select the organization and choose the repositories to collect `SKILL.md` files from. Only the repositories with the app installed can serve private documents.

## Environment variables

Copy the `.env.local.example` file to create the `.env.local` file.

```shell
cp .env.local.example .env.local
```

```properties
APP_ID=
APP_PRIVATE_KEY=
```

- Enter the **App ID** from the app settings page in `APP_ID`.
- Enter the entire contents of the downloaded `.pem` file in `APP_PRIVATE_KEY`, wrapped in double quotes. It is a multi-line value that includes line breaks.

Add the following environment variables only when you need them.

| Environment variable        | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`              | Used when public repositories without the app installed are listed together     |
| `SITE_URL`                  | Sets the deployment URL when self-hosting; used for share card image URLs       |
| `HTTPS_PROXY`, `HTTP_PROXY` | Sets the proxy URL on an internal network that reaches the internet via a proxy |

## Repository list

Copy the `repositories.example.yaml` file to create the `repositories.yaml` file, and list the repositories to collect in `{owner}/{repo}` format.

```shell
cp repositories.example.yaml repositories.yaml
```

```yaml
- aroundus/skillpedia
- anthropics/skills
```

In production, inject the same YAML content through the `REPOSITORIES` environment variable. When the `REPOSITORIES` environment variable is defined, the app does not read the `repositories.yaml` file.

## Run

```shell
nvm install
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Deploy

Deploy with pm2 to an internal server that has a self-hosted runner registered.

First, move the `.github/workflows/templates/build-and-deploy.yml` file to the `.github/workflows` folder. Next, register the values the workflow uses under **Secrets and variables** in the repository settings.

| Type      | Name                                                                       |
| --------- | -------------------------------------------------------------------------- |
| Variables | `APP_ID`, `REPOSITORIES`                                                   |
| Secrets   | `APP_PRIVATE_KEY`, `PAT` (a personal access token for public repositories) |

Finally, run the **Build and deploy** workflow from the **Actions** tab. The runner creates the `.env` file, builds the app, and serves it on port 3000 with pm2.

## Troubleshooting

### The repository list is empty

- Check that the `repositories.yaml` file is in the repository root.
- Check that the `REPOSITORIES` environment variable is not defined with an empty value. When the environment variable is defined, the app does not read the `repositories.yaml` file even if the value is empty.

### Private repository docs return 404

- Check that the GitHub App is installed on the repository.
- Check that the **Contents** permission of the app is set to **Read-only**.

### GitHub API calls fail

- On an internal network, check that the `HTTPS_PROXY` or `HTTP_PROXY` environment variable is set.
- When the proxy requires credentials, check that you entered them in `http://{user}:{password}@{host}:{port}` format.

### APP_PRIVATE_KEY fails to parse

- Check that you entered the entire contents of the `.pem` file, from `-----BEGIN RSA PRIVATE KEY-----` to `-----END RSA PRIVATE KEY-----`.
- Check that the whole value is wrapped in double quotes.
