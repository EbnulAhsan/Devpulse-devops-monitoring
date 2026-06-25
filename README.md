# DevPulse — Backend API with DevOps Monitoring & CI/CD Deployment

![Terraform](https://img.shields.io/badge/Terraform-IaC-844FBA)
![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)
![Docker Compose](https://img.shields.io/badge/Container-Docker%20Compose-2496ED)
![Grafana](https://img.shields.io/badge/Visualization-Grafana-F46800)
![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C)
![Loki](https://img.shields.io/badge/Logs-Loki-yellow)
![Promtail](https://img.shields.io/badge/Log%20Shipper-Promtail-blue)
![Node Exporter](https://img.shields.io/badge/Host%20Metrics-Node%20Exporter-grey)

---

## 1. Project Overview

**DevPulse** is a backend REST API for tracking bugs and feature requests within a development team.

This repository also includes a complete **DevOps monitoring and deployment solution** using Terraform, GitHub Actions, Docker Compose, Grafana, Prometheus, Loki, Promtail, and Node Exporter.

The DevOps assignment was implemented on top of an existing DevPulse backend project. The backend application was deployed to an **AWS EC2 Ubuntu server** and monitored using a full observability stack.

---

## 2. Live Links

| Service | URL / Details |
|---|---|
| **Backend API** |  |
| **Grafana Dashboard** |  |
| **Grafana Login** | Username: `` \| Password: `` |
| **Original Vercel API** | https://devpulsebackendfinal.vercel.app |
| **GitHub Repository** | https://github.com/EbnulAhsan/Devpulse-devops-monitoring |

> ⚠️ **Note:** The default Grafana password should be changed after first login for better security.

---

## 3. Assignment Requirements Covered

| Requirement | Status |
|---|---|
| Use Terraform to provision a cloud server | ✅ Completed |
| Create a CI/CD pipeline for automated deployment | ✅ Completed |
| Install and configure Grafana | ✅ Completed |
| Install and configure Loki | ✅ Completed |
| Install and configure Promtail | ✅ Completed |
| Install and configure Node Exporter | ✅ Completed |
| Create Grafana dashboard for CPU, Memory, Disk, Network metrics | ✅ Completed |
| Show system/application logs using Loki | ✅ Completed |
| Upload Terraform files to GitHub | ✅ Completed |
| Upload CI/CD workflow files to GitHub | ✅ Completed |
| Upload Grafana dashboard JSON | ✅ Completed |
| Add documentation and screenshots | ✅ Completed |

---

## 4. Architecture

```
Developer Pushes Code
        |
        v
GitHub Repository
        |
        v
GitHub Actions CI/CD Pipeline
        |
        v
AWS EC2 Ubuntu Server
        |
        |-- DevPulse Backend Container
        |-- Grafana Container
        |-- Prometheus Container
        |-- Node Exporter Container
        |-- Loki Container
        |-- Promtail Container
```

**Monitoring Flow**

```
Node Exporter -> Prometheus -> Grafana
Promtail -> Loki -> Grafana
Docker/System Logs -> Promtail -> Loki -> Grafana
```

---

## 5. Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | PostgreSQL / NeonDB |
| Authentication | JWT + bcrypt |
| Build Tool | tsup |
| Original Deployment | Vercel |

### DevOps

| Layer | Technology |
|---|---|
| Infrastructure as Code | Terraform |
| Cloud Provider | AWS EC2 |
| Operating System | Ubuntu |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| Container Orchestration | Docker Compose |
| Metrics | Prometheus |
| Host Metrics Exporter | Node Exporter |
| Logs | Loki |
| Log Shipper | Promtail |
| Visualization | Grafana |

---

## 6. Repository Structure

```
Devpulse-devops-monitoring/
│
├── api/
├── src/
├── terraform/
│   ├── provider.tf
│   ├── variables.tf
│   ├── main.tf
│   ├── outputs.tf
│   └── .terraform.lock.hcl
│
├── monitoring/
│   ├── prometheus/prometheus.yml
│   ├── loki/loki-config.yml
│   ├── promtail/promtail-config.yml
│   └── grafana/
│       ├── datasources/datasource.yml
│       ├── dashboard-providers/dashboard-provider.yml
│       └── dashboards/devpulse-dashboard.json
│
├── .github/workflows/deploy.yml
├── screenshots/
├── keys/devpulse-ec2-key.pub
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 7. Backend Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Contributor and maintainer roles
- Bug and feature request management
- Issue filtering and sorting
- Centralized error handling
- PostgreSQL database support
- TypeScript build using tsup

---

## 8. API Endpoints

**Base URL:** `http://47.129.231.97:5000`
**Original Vercel URL:** `https://devpulsebackendfinal.vercel.app`

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive JWT token | Public |

**Example signup request:**

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "role": "contributor"
}
```

**Example login request:**

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Issue Routes — `/api/issues`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/issues` | Create a new issue | Contributor, Maintainer |
| GET | `/api/issues` | Get all issues | Public |
| GET | `/api/issues/:id` | Get a single issue | Public |
| PATCH | `/api/issues/:id` | Update an issue | Owner / Maintainer |
| DELETE | `/api/issues/:id` | Delete an issue | Maintainer only |

**Example issue request:**

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

**Protected routes require an Authorization header:**

```
Authorization: Bearer <jwt_token>
```

---

## 9. Permission Rules

### Contributor
- Can create issues
- Can update only own issues
- Can update issues only while status is `open`
- Cannot change issue status
- Cannot delete issues

### Maintainer
- Can update any issue
- Can change issue status
- Can delete any issue

---

## 10. Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL |
| role | VARCHAR(20) | contributor / maintainer |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### `issues`

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | NOT NULL |
| type | VARCHAR(30) | bug / feature_request |
| status | VARCHAR(30) | open / in_progress / resolved |
| reporter_id | INTEGER | REFERENCES users(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## 11. Local Development Setup

**Clone repository**

```bash
git clone https://github.com/EbnulAhsan/Devpulse-devops-monitoring.git
cd Devpulse-devops-monitoring
```

**Install dependencies**

```bash
npm install
```

**Create `.env` file**

```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

**Run development server**

```bash
npm run dev
```

Server runs on `http://localhost:5000`

**Build and start production server**

```bash
npm run build
npm start
```

---

## 12. Docker Setup

The backend and monitoring stack are containerized using Docker and orchestrated with Docker Compose:

- backend
- grafana
- prometheus
- node-exporter
- loki
- promtail

**Start stack manually on server**

```bash
docker compose up -d --build
```

**Stop stack**

```bash
docker compose down --remove-orphans
```

**Check running containers**

```bash
docker compose ps
```

---

## 13. Terraform Infrastructure

Terraform provisions an AWS EC2 Ubuntu server for the backend and monitoring stack.

**Terraform files**

```
terraform/provider.tf
terraform/variables.tf
terraform/main.tf
terraform/outputs.tf
```

**AWS resources created**

- AWS Key Pair
- Security Group
- EC2 Ubuntu Instance

**Open ports**

| Port | Purpose |
|---|---|
| 22 | SSH |
| 3000 | Grafana |
| 5000 | Backend API |
| 80 | HTTP |
| 443 | HTTPS |

**Terraform commands**

```bash
cd terraform
terraform init
terraform validate
terraform plan
terraform apply
```

**Example Terraform outputs**

```
backend_url = "http://47.129.231.97:5000"
grafana_url = "http://47.129.231.97:3000"
public_ip   = "47.129.231.97"
```

---

## 14. CI/CD Pipeline

GitHub Actions automates deployment to the AWS EC2 server.

**Workflow file:** `.github/workflows/deploy.yml`

**Pipeline flow**

```
Push to main branch
        |
        v
GitHub Actions starts
        |
        v
Checkout repository
        |
        v
Configure SSH
        |
        v
Create .env file from GitHub Secrets
        |
        v
SSH into EC2
        |
        v
Pull latest code
        |
        v
Run docker compose up -d --build
```

**Required GitHub Secrets**

| Secret | Description |
|---|---|
| `EC2_HOST` | Public IP address of the EC2 instance |
| `EC2_USER` | SSH user, usually `ubuntu` |
| `EC2_SSH_KEY` | Private SSH key used to connect to EC2 |
| `ENV_FILE` | Full `.env` file content for backend |

---

## 15. Monitoring Stack

### Prometheus
Prometheus collects metrics from Node Exporter.
`monitoring/prometheus/prometheus.yml`

### Node Exporter
Node Exporter exposes host metrics such as CPU usage, memory usage, disk usage, network traffic, and uptime.

### Loki
Loki stores and indexes logs.
`monitoring/loki/loki-config.yml`

### Promtail
Promtail ships Docker and system logs to Loki.
`monitoring/promtail/promtail-config.yml`

### Grafana
Grafana visualizes Prometheus metrics and Loki logs.

```
monitoring/grafana/datasources/datasource.yml
monitoring/grafana/dashboard-providers/dashboard-provider.yml
monitoring/grafana/dashboards/devpulse-dashboard.json
```

---

## 16. Grafana Dashboard

**Dashboard name:** DevPulse Backend Monitoring Dashboard
**Dashboard folder:** DevPulse

**Dashboard panels**

- CPU Usage
- Memory Usage
- Disk Usage
- Server Uptime
- Network Receive
- Network Transmit
- System and Docker Logs

---

## 17. Loki Log Queries

**Docker logs:**

```
{job="docker"}
```

**System logs:**

```
{job="system"}
```

**Combined dashboard log query:**

```
{job=~"docker|system"}
```

---

## 18. Screenshots

| Screenshot | File Path |
|---|---|
| Terraform deployment | `screenshots/terraform-apply.png` |
| GitHub Actions pipeline success | `screenshots/github-actions-success.png` |
| Grafana dashboard | `screenshots/grafana-dashboard.png` |
| Loki logs visualization | `screenshots/loki-logs.png` |
| Prometheus targets | `screenshots/prometheus-targets.png` (optional) |
| Docker containers running | `screenshots/docker-containers-running.png` (optional) |

---

## 19. Useful Server Commands

```bash
ssh -i keys/devpulse-ec2-key ubuntu@47.129.231.97
cd /opt/devpulse/app
docker compose ps
docker logs devpulse-backend --tail=50
docker logs grafana --tail=80
docker logs loki --tail=80
docker logs promtail --tail=80
docker compose down --remove-orphans
docker compose up -d --build
```

---

## 20. Security Notes

- `.env` file is not committed to GitHub.
- Terraform state files are ignored.
- Private SSH key is ignored.
- AWS access keys are not stored in the repository.
- Sensitive deployment data is stored in GitHub Actions Secrets.
- Grafana default admin password should be changed after first login.
- AWS access keys used for assignment should be deactivated or deleted after submission.

---

## 21. Important `.gitignore` Rules

```
node_modules
dist
.env.vercel
keys/devpulse-ec2-key
*.pem

terraform/.terraform/
terraform/terraform.tfstate
terraform/terraform.tfstate.backup
terraform/*.tfvars
terraform/crash.log
```

---

## 22. Final Deliverable

**GitHub Repository:** https://github.com/EbnulAhsan/Devpulse-devops-monitoring

This repository contains Terraform configuration files, CI/CD workflow files, Docker Compose deployment, Grafana dashboard JSON, Loki/Promtail/Prometheus configuration, documentation, and screenshots.

---

## 23. Author

**Md Ebnul Ahsan**

Built as part of a DevOps monitoring and deployment assignment using an existing DevPulse backend project.
