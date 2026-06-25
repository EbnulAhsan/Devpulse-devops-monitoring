// import express, { Application, Request, Response } from "express";
// import cors from "cors";
// import authRoutes from "./auth/auth.route";
// import issuesRoutes from "./modules/issues/issues.route";
// import requestLogger from "./middleware/logger";
// import globalErrorHandler from "./middleware/globalErrorHandelar";
// import pool, { createTables } from "./db";
// import logger from "./logger";

// const app: Application = express();


// app.use(cors());
// app.use(express.json());
// app.use(requestLogger);


// (async () => {
//     try {
//         await pool.query("SELECT NOW()");
//         logger.info("Database connected successfully");

//         await createTables();
//         logger.info("Database tables are ready");
//     } catch (error) {
//         logger.error("Database connection failed");
//         console.error(error);
//     }
// })();


// app.get("/", (req: Request, res: Response) => {
//     res.send("DevPulse API is running ✅");
// });


// app.use("/api/auth", authRoutes);
// app.use("/api/issues", issuesRoutes);


// app.use(globalErrorHandler);


// app.use((req: Request, res: Response) => {
//     res.status(404).json({
//         success: false,
//         message: "API route not found",
//     });
// });


// export default app;



import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./auth/auth.route";
import issuesRoutes from "./modules/issues/issues.route";
import requestLogger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandelar";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);



// Root route
app.get("/", (req: Request, res: Response) => {
    res.send("DevPulse API is running ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});

export default app;

