import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      res.status(200).json("Store API");
    } catch (error) {
      res.status(500).json({ message: "Failed to get API", error });
    }
});

export default router;