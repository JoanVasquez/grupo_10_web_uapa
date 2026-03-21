import "reflect-metadata";
import { app } from "./app";
import { appPort } from "./utils/constants";
import { registerDependencies } from "./container";

const startServer = async () => {
  try {
    await registerDependencies();
    app.listen(appPort, () => {
      console.log(`🚀 API Gateway running on port ${appPort}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      process.exit(0);
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      process.exit(0);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
