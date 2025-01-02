# Paathshala Server

This repository contains the configuration and deployment files for Paathshala Server. It includes the necessary Docker setup to spin up databases and deploy the complete application with monitoring tools.

## Prerequisites

- Docker
- Docker Compose

## Setup

### 1. Spin up the Databases

To only spin up the databases (without deploying the whole application), run the following command:

```bash
docker compose up -d
```

This will start the databases in detached mode, allowing you to work with the database services independently.

### 2. Deploy the Entire Application

To deploy the whole application, including the databases and monitoring services, run the following command:

```bash
docker-compose -f docker-compose-prod.yml up -d
```

This will launch all the necessary services and components in detached mode, including monitoring tools for your production environment.

## Stopping and Cleaning Up Services

### Stop the Services

To stop the running services without removing containers or volumes:

```bash
docker compose down
```

To stop all running containers without removing them, use:

```bash
docker stop $(docker ps -q)
```

### Remove Containers, Networks, and Volumes

To stop and remove all containers, networks, and volumes associated with the services, use:

```bash
docker compose down -v
```

- `-v` flag will also remove the volumes.
- Without `-v`, only the containers and networks will be removed, and volumes will persist.

### Deleting Unused Docker Resources

To remove unused Docker networks, volumes, and containers (that aren't associated with any running container):

1. **Remove all unused volumes:**

   ```bash
   docker volume prune
   ```

2. **Remove all unused networks:**

   ```bash
   docker network prune
   ```

3. **Remove all stopped containers:**

   ```bash
   docker container prune
   ```

4. **Remove all unused images:**

   ```bash
   docker image prune -a
   ```

You can also prune all of the above resources in a single command:

```bash
docker system prune -a
```

This will remove stopped containers, unused networks, dangling images, and build cache.

## Mass Removal

### Stop and Remove All Containers

To stop and remove **all** containers, use:

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

This will stop and remove all containers, including the ones that are not running.

### Remove All Volumes

If you want to remove **all volumes**, use:

```bash
docker volume rm $(docker volume ls -q)
```

### Remove All Networks

To remove all Docker networks (excluding the default ones):

```bash
docker network rm $(docker network ls -q)
```

## Configuration

- `docker-compose.yml`: Default configuration for spinning up only databases.
- `docker-compose-prod.yml`: Production configuration for spinning up the full application along with monitoring tools.

Make sure to adjust the environment variables and configuration in the `.env` file or within the respective Docker Compose files before deploying.

## Troubleshooting

- If you run into issues with the containers not starting, you can check the logs using the following command:

```bash
docker logs <container_name>
```

- To see the status of all running containers:

```bash
docker ps
```

## License

Include any relevant licensing information here.

---

This update includes instructions for managing Docker containers, volumes, networks, and images, along with commands to prune and clean up resources effectively. Let me know if you'd like any more changes!
