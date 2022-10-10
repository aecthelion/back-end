import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "@src/config";
import { logger } from "@utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app: express.Application = express();

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "RockIt",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${config.get("PORT")}/api`,
        description: "Local server",
      },
    ],
  },
  apis: ["./**/*.routes*.ts", "./**/*.definitions.yaml"],
};
const swaggerSpecification = swaggerJsdoc(options);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth", require("./auth/auth.routes"));
app.use("/api/user", require("./user/user.routes"));
app.use("/api/vacancies", require("./vacancy/vacancy.routes"));
app.use(
  "/api/user-application",
  require("./userApplication/userApplication.routes")
);
app.use("/api/course", require("./course/course.routes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

async function start() {
  const PORT = config.get("PORT");
  const MONGO_URI = config.get<string>("MONGO_URI");

  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () =>
      logger.info(`Server has been started on port ${PORT}`)
    );
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Server error", e.message);
    }

    process.exit(1);
  }
}

start();
