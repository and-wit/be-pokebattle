import express from "express";
import cors from "cors";
import logger from "./utils/log/logger.js";
import morgan from "morgan";

import errorHandler from "./utils/error/errorHandler.js";
import ErrorResponse from "./utils/error/ErrorResponse.js";

const app = express();
const morganFormat = ":method :url :status :response-time ms";

app.use(cors());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(express.json());

// app.use('/{route}', {router});

app.use("*", (req, res, next) => {
  next(new ErrorResponse(`Cannot find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

export default app;
