import express from "express";
import authRouter from "./auth/index";
import eventsRouter from "./events/index";
import favoriteRouter from "./favorite/index";
import storeRouter from "./store/index";

function registerRoutes(app: ReturnType<typeof express>) {
    app.use("/api/auth", authRouter);
    app.use("/api/events", eventsRouter);
    app.use("/api/favorites", favoriteRouter);
    app.use("/api/store", storeRouter);
}

export default registerRoutes;
