# ClaraVerse Docker Compose Guide

This guide helps you set up and run ClaraVerse and all its services using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your system
- At least 8GB of RAM (16GB recommended for running multiple AI models)
- 20GB+ free disk space for models and data

## Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/jeremywaller/ClaraVerse.git
   cd ClaraVerse
   ```

2. Start all services:
   ```bash
   docker compose up -d
   ```

3. Access ClaraVerse:
   - Web UI: http://localhost:8069
   - N8N: http://localhost:5678

## Building the Images

The docker-compose.yml file is configured to build the required ClaraVerse images locally:

- `clara-app`: Main ClaraVerse UI built from the project's Dockerfile
- `clara-backend`: Python backend service built from the py_backend/Dockerfile

External services are pulled from Docker Hub:
- `clara-interpreter`: Pulled from clara17verse/clara-interpreter:latest
- `clara-n8n`: Pulled from n8nio/n8n:1.91.3
- `clara-ollama`: Pulled from ollama/ollama:0.7.0

## Services

The docker-compose.yml file includes the following services:

| Service | Description | Port Mapping | Container Name |
|---------|-------------|-------------|---------------|
| clara-app | Main ClaraVerse UI | 8069:8069 | clara_app |
| clara-backend | Python backend for file handling, RAG, etc. | 5001:5000 | clara_python |
| clara-interpreter | Code interpreter service | 8000:8000 | clara_interpreter |
| clara-n8n | N8N workflow automation | 5678:5678 | clara_n8n |
| clara-ollama | Ollama for running local AI models | 11434:11434 | clara_ollama |

## Volumes

Persistent data is stored in the following Docker volumes:

- `clara_data`: App settings and user data
- `clara_interpreter_data`: Code interpreter files and environment
- `clara_n8n_data`: N8N workflows and settings
- `clara_ollama_data`: AI models and Ollama configuration

## Managing Services

### View running containers:
```bash
docker compose ps
```

### View logs:
```bash
docker compose logs -f clara-app  # View logs for the main app
docker compose logs -f            # View all logs
```

### Stop all services:
```bash
docker compose down
```

### Restart a specific service:
```bash
docker compose restart clara-ollama
```

## Troubleshooting

If you encounter issues:

1. Check container logs for errors:
   ```bash
   docker compose logs -f <service-name>
   ```

2. Ensure all services are healthy:
   ```bash
   docker compose ps
   ```

3. Restart all services:
   ```bash
   docker compose down
   docker compose up -d
   ```

4. For Ollama model issues, try accessing the Ollama API directly:
   ```bash
   curl http://localhost:11434/api/tags
   ```

## Advanced Configuration

To modify ports or add custom environment variables, edit the `docker-compose.yml` file before running `docker compose up -d`.

### Environment Variables

The following environment variables can be adjusted in the docker-compose.yml file:

| Service | Variable | Description |
|---------|----------|-------------|
| clara-backend | PYTHONUNBUFFERED | Ensures Python output is sent directly to container logs |
| clara-backend | OLLAMA_BASE_URL | URL for connecting to the Ollama API service |
| clara-interpreter | PYTHONUNBUFFERED | Ensures Python output is sent directly to container logs |
| clara-interpreter | OLLAMA_BASE_URL | URL for connecting to the Ollama API service |
| clara-n8n | N8N_PORT | Port on which N8N will listen |
| clara-n8n | N8N_PROTOCOL | Protocol for N8N connections (http/https) |
| clara-n8n | N8N_HOST | Hostname for N8N service |
| clara-n8n | WEBHOOK_URL | URL for webhook callbacks |
| clara-n8n | N8N_EDITOR_BASE_URL | Base URL for the N8N editor UI |

### Resource Limits

All services have CPU and memory limits configured to prevent resource exhaustion:

| Service | CPU Limit | Memory Limit |
|---------|-----------|--------------|
| clara-app | 1.0 | 1GB |
| clara-backend | 0.5 | 512MB |
| clara-interpreter | 0.8 | 1GB |
| clara-n8n | 0.5 | 512MB |
| clara-ollama | 2.0 | 4GB |

These limits can be adjusted in the docker-compose.yml file based on your system capabilities.

## Resources

- [ClaraVerse Documentation](https://github.com/jeremywaller/ClaraVerse)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [N8N Documentation](https://docs.n8n.io/)