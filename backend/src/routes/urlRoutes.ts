import { Router } from "express";
import { createShortUrl, getUrlStats } from "../controllers/urlController";

const router = Router();

router.post("/shorturls", createShortUrl);
router.get("/shorturls/:shortcode", getUrlStats);

export default router;
