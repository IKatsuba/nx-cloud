# [WIP] Nx Cloud Community Edition

Original Nx Cloud is a service that helps you and your team scale your Nx workspace. It provides a dashboard that gives you
insights into your workspace's health, and it provides a set of CI integrations that help you and your team get the most
out of Nx.

---

This project is a work in progress. We are currently working on the first version of Nx Cloud Community Edition.

API server based on public [Nx Cloud Server API Reference](https://nx.dev/nx-cloud/reference/server-api).

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 18.0.0)
- Docker (>= 20.10.8) and [Docker Compose](https://docs.docker.com/compose/) (>= 1.29.2)

### Steps

1. Clone the repo
2. Install dependencies: `npm install`
3. Run docker-compose: `docker-compose up -d`
4. Run api server: `nx serve`

## Roadmap

- [x] Distributed Caching
- [ ] Distributed Task Execution
- [ ] Nx Cloud Dashboard
- [ ] GitHub Integration
- [ ] GitLab Integration
