import express, { NextFunction, Request, Response } from "express";
import { mockEvents } from "../../constants/eventsMock.mock";
import { eventDb, authDb } from "../../DB/index";
import admin from "firebase-admin";

const router = express.Router();

router.get("/MockData", (req, res) => {
  res.status(200).json(mockEvents);
});

router.get("/test_eventdb", async (req, res) => {
  try {
    await eventDb
      .collection("test-connection")
      .doc("event")
      .set({ status: "OK", timestamp: Date.now() });
    console.log("Firebase connections successful.");
  } catch (err) {
    console.error("Firebase connection failed:", err);
  }
});

/**
 * GET /
 * Get all events data
 */
router.get("/", async (req, res) => {
  try {
    const eventsSnapshot = await eventDb.collection("event").get();
    const events = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(events);
  } catch (error) {
    console.error("GET events fail：", error);
    res.status(500).json({ error: "GET events Fail" });
  }
});

/**
 * POST /dataEdit
 * Add ONE data to the event collection. ONLY admin can add the data in this system.
 */
router.post("/dataEdit", async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData = req.body;

    eventData.createUser = eventData.host;
    eventData.logUser = eventData.host;
    eventData.createAt = new Date().toISOString();
    eventData.updateAt = new Date().toISOString();

    const docRef = await eventDb.collection("event").add(eventData);
    res
      .status(201)
      .json({ message: "Event created successfully", id: docRef.id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event", error });
  }
});

/**
 * PUT /dataEdit/:id
 * Update event collection by event.id
 */
router.put(
  "/dataEdit/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      updateData.updateAt = new Date().toISOString();

      await eventDb.collection("event").doc(id).update(updateData);
      res
        .status(200)
        .json({ message: "Event updated successfully", event: updateData });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event", error });
    }
  }
);

/**
 * DELETE /dataEdit/:id
 * Delete one event collection by event.id
 */
router.delete(
  "/dataEdit/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await eventDb.collection("event").doc(id).delete();
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event", error });
    }
  }
);

/**
 * DELETE /dataEdit
 * Batch delete data from event collection. Body should include { ids: string[] }
 */
router.delete(
  "/dataEdit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ message: "No event IDs provided for deletion" });
        return;
      }
      const batch = eventDb.batch();
      ids.forEach((id: string) => {
        const docRef = eventDb.collection("event").doc(id);
        batch.delete(docRef);
      });
      await batch.commit();
      res.status(200).json({ message: "Batch deletion successful" });
    } catch (error) {
      console.error("Error in batch deleting events:", error);
      res.status(500).json({ message: "Failed to batch delete events", error });
    }
  }
);

/**
 * POST /eventOrder
 * Add the data to eventOrder collection.
 */
router.post(
  "/eventOrder",
  async (req: Request, res: Response): Promise<any> => {
    try {
      // The data from EventCheckout
      const {
        event, // event.id
        tickets, // array of { sessionID: string, quantity: number }, quantity=the amount of tikcet in collection
        accountID, // account id
        couponCode, // (optional)
        paymentMethod, // 'Stripe' | 'Paypal' | 'ETransfer'
        paymentFields, // CardName, country, postal code...
        subtotal, // subtotal
        GST, // GST
        total, // Total
      } = req.body;

      // 1. Filter： at least one ticket should be choosen.
      const totalTickets = tickets.reduce(
        (sum: number, ticket: { quantity: number }) => {
          return sum + (ticket.quantity || 0);
        },
        0
      );
      if (totalTickets < 1) {
        return res
          .status(400)
          .json({ message: "At least one ticket must be purchased." });
      }

      // 2. Filter： Validating columns by different payment method.
      if (paymentMethod === "Stripe") {
        if (
          !paymentFields?.cardName ||
          !paymentFields?.country ||
          !paymentFields?.postalCode
        ) {
          return res
            .status(400)
            .json({ message: "Incomplete Stripe payment fields." });
        }
      } else if (paymentMethod === "Paypal") {
        if (!paymentFields?.paypalEmail) {
          return res
            .status(400)
            .json({ message: "Incomplete Paypal payment fields." });
        }
      } else if (paymentMethod === "ETransfer") {
      } else {
        return res.status(400).json({ message: "Invalid payment method." });
      }

      // 3. Filter: coupon code
      let couponID: string | null = null;
      if (couponCode) {
        const couponSnapshot = await authDb
          .collection("coupon")
          .where("code", "==", couponCode)
          .get();
        if (couponSnapshot.empty) {
          return res.status(400).json({ message: "Invalid promo code." });
        } else {
          couponID = couponSnapshot.docs[0].id;
        }
      }

      // 4. Add the data to eventOrder collection
      const eventOrderRef = await authDb.collection("eventOrder").add({
        eventID: event.id,
        accountID,
        couponID,
        subtotal,
        GST,
        total,
        updateAt: new Date().toISOString(),
      });

      // 5. Create the subcollection "ticket" into eventOrder collection if the quantity>0
      // If the user buy the same and multiple tikcets in one order, it will generate multiple files to ticket subcollection.
      const ticketPromises = tickets.map(
        async (ticket: { sessionID: string; quantity: number }) => {
          if (ticket.quantity > 0) {
            const ticketCollection = eventOrderRef.collection("ticket");
            const promises = [];
            for (let i = 0; i < ticket.quantity; i++) {
              promises.push(
                ticketCollection.add({
                  sessionID: ticket.sessionID,
                  status: "NotUsed",
                  accountID,
                  createdAt: new Date().toISOString(),
                })
              );
            }
            return Promise.all(promises);
          }
          return null;
        }
      );
      await Promise.all(ticketPromises);

      return res
        .status(201)
        .json({ message: "Checkout successful", orderID: eventOrderRef.id });
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({ message: "Checkout failed", error });
    }
  }
);

/**
 * GET /eventOrder/:accountID
 * Get the eventOrder data by account.id
 * Also, using the eventID to find the fields detail from event collection.
 * QRCode Column Format: ticketDoc.id+++ticketData.sessionID，ex："KmiMgvdCpbfzHL7Yv9zC+++sess_hQ7kNzLmBpy93KrX"
 */
router.get(
  "/eventOrder/:accountID",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { accountID } = req.params;

      // Get eventOrder coleection data by account.id
      const orderSnapshot = await authDb
        .collection("eventOrder")
        .where("accountID", "==", accountID)
        .get();

      // Process each eventOrder file
      const orders = await Promise.all(
        orderSnapshot.docs.map(async (doc) => {
          const orderData = doc.data();
          orderData.id = doc.id; // eventOrder.id

          // Join orderData.eventID=event.id
          const eventDoc = await eventDb
            .collection("event")
            .doc(orderData.eventID)
            .get();
          if (eventDoc.exists) {
            orderData.event = { id: eventDoc.id, ...eventDoc.data() };
          }

          // Get the joined session data from event parent collection. Every event collection should have at least one session.
          const eventSessions: any[] = orderData.event?.session || [];

          // select ticket.* from eventOrder. ticket is the subcollection from eventOrder.
          // Also, generate QRCode field for each field. ("ticket.id+++session.id")
          const ticketsSnapshot = await doc.ref.collection("ticket").get();
          const tickets = ticketsSnapshot.docs.map((ticketDoc) => {
            const ticketData = ticketDoc.data();
            ticketData.id = ticketDoc.id;

            // Find event's session fields information by ticket.sessionID
            const matchingSession = eventSessions.find(
              (sess) => sess.sessionID === ticketData.sessionID
            );
            ticketData.sessionDetail = matchingSession || null;

            ticketData.QRCode = `${ticketDoc.id}+++${ticketData.sessionID}`;
            return ticketData;
          });
          orderData.tickets = tickets;

          return orderData;
        })
      );

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching event orders:", error);
      res.status(500).json({ message: "Failed to fetch event orders", error });
    }
  }
);

/**
 * GET /eventOrderTicketCheck
 * FOR checking ticket is exists in database. Checking by ticket.id and session.id
 */
router.get(
  "/eventOrderTicketCheck",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { ticketID, sessionID } = req.query;
      if (!ticketID || !sessionID) {
        return res
          .status(400)
          .json({ message: "ticketID and sessionID are required" });
      }

      // Using collectionGroup to find the ticket subcollection is exist ticket.id
      const ticketQuery = await authDb
        .collectionGroup("ticket")
        .where(admin.firestore.FieldPath.documentId(), "==", ticketID as string)
        .get();
      if (ticketQuery.empty) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const ticketDoc = ticketQuery.docs[0];
      const ticketData = ticketDoc.data();

      // Checking ticket's fields is exist session.id
      if (ticketData.sessionID === sessionID) {
        return res
          .status(200)
          .json({
            message: "Ticket check passed",
            ticket: { id: ticketDoc.id, ...ticketData },
          });
      } else {
        return res.status(400).json({ message: "SessionID does not match" });
      }
    } catch (error) {
      console.error("Error in ticket check:", error);
      return res.status(500).json({ message: "Ticket check failed", error });
    }
  }
);

export default router;
