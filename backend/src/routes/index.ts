import express from "express";
import authRouter from "./auth/index";
import eventsRouter from "./events/index";

function registerRoutes(app: ReturnType<typeof express>) {
    app.use("/api/auth", authRouter);
    app.use("/api/events", eventsRouter);
}

export default registerRoutes;
