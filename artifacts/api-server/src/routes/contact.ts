import { Router, type IRouter } from "express";
import { db, insertContactSchema } from "@workspace/db";
import { contactsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = insertContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
    return;
  }

  try {
    const [contact] = await db.insert(contactsTable).values(parsed.data).returning();
    req.log.info({ contactId: contact.id }, "New contact message received");
    res.status(201).json({ success: true, id: contact.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save contact message");
    res.status(500).json({ error: "Error al guardar el mensaje" });
  }
});

export default router;
