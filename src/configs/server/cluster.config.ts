import cluster from "cluster";
import os from "os";
import { startServer } from "./server.config";
import { infoLogger, errorLogger } from "../../cores";
import { Application } from "express";

export const setupCluster = (app: Application) => {
  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    infoLogger.info(`Primary process ${process.pid} is running`);
    infoLogger.info(`Forking ${numCPUs} workers...`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Restart workers on crash
    cluster.on("exit", (worker, code) => {
      errorLogger.error(
        `Worker ${worker.process.pid} died with code ${code}. Restarting...`
      );
      cluster.fork();
    });
  } else {
    // Worker processes run the server
    startServer(app).catch((error) => {
      errorLogger.error(
        `Error in worker process ${process.pid}: ${error.message}`
      );
      process.exit(1);
    });
  }
};
