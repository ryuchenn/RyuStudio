import express, { Request, Response } from "express";
import { authDb, eventDb } from "../../DB/index";
import { Favorite } from '../../types/favorite';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json("Favorite API");
  } catch (error) {
    res.status(500).json({ message: "Failed to get API", error });
  }
});

/**
 * GET /isFavorite
 * Check the data(only one) at the EventDetail page is favorite or not favorite
 */
router.get("/isFavorite", async (req: Request, res: Response) => {
  try {
    const { uid, eventID } = req.query;

    const favoritesSnapshot = await authDb
      .collection("favorite")
      .where("accountID", "==", uid)
      .where("eventID", "==", eventID)
      .get();

    const favorites = favoritesSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Favorite, "id">; // accountID and eventID
      return {
        id: doc.id,
        ...data,
      };
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Failed to fetch favorites", error });
  }
});

/**
 * GET /:accountID
 * Get the user data at the favorite collection by account.id(uid)
 */
router.get("/:accountID", async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;

    const favoritesSnapshot = await authDb
      .collection("favorite")
      .where("accountID", "==", accountID)
      .get();

    const favorites = favoritesSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Favorite, "id">;
      return {
        id: doc.id,
        ...data,
      };
    });

    const results = await Promise.all(
      favorites.map(async (fav) => {
        const eventDoc = await eventDb
          .collection("event")
          .doc(fav.eventID)
          .get();
        const eventData = eventDoc.exists
          ? { id: eventDoc.id, ...eventDoc.data() }
          : null;
        return {
          uid: accountID,
          favoriteID: fav.id,
          // eventID: fav.eventID,
          event: eventData,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Failed to fetch favorites", error });
  }
});

/**
 * POST /
 * Add one data to favorite collection
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { accountID, eventID } = req.body;
    if (!accountID || !eventID) {
      return res.status(400).json({ message: "Missing accountID or eventID" });
    }
    const newFavorite = {
      accountID,
      eventID,
      createAt: new Date().toISOString(),
    };
    const docRef = await authDb.collection("favorite").add(newFavorite);
    res.status(201).json({
      message: "Favorite added successfully",
      id: docRef.id,
      favorite: newFavorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Failed to add favorite", error });
  }
});

/**
 * DELETE /:favoriteID
 * Delete one favorite collection data by favorite.id
 */
router.delete("/:favoriteID", async (req: Request, res: Response) => {
  try {
    const { favoriteID } = req.params;
    await authDb.collection("favorite").doc(favoriteID).delete();
    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Failed to delete favorite", error });
  }
});

/**
 * DELETE /:favoriteID
 * Batch delete favorite collection data by favorite.id
 */
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { favoriteIDs } = req.body;
    if (!Array.isArray(favoriteIDs) || favoriteIDs.length === 0) {
      return res.status(400).json({ message: "No favoriteIDs provided" });
    }
    const batch = authDb.batch();
    favoriteIDs.forEach((id: string) => {
      const ref = authDb.collection("favorite").doc(id);
      batch.delete(ref);
    });
    await batch.commit();
    res.status(200).json({ message: "Favorites deleted successfully" });
  } catch (error) {
    console.error("Error batch deleting favorites:", error);
    res.status(500).json({ message: "Failed to delete favorites", error });
  }
});

export default router;
