import type { Request, Response } from "express";
import { Url } from "../models/Url";
import {
  generateShortCode,
  validateUrl,
  validateShortCode,
  getExpirationDate,
  getFullShortUrl,
  getIpInfo,
} from "../utils/url";
import { logger } from "../utils/logger";

export const createShortUrl = async (req: Request, res: Response) => {
  const { url, validity, shortcode } = req.body;

  if (!url || !validateUrl(url)) {
    logger("warn", "backend", "controller", "Invalid URL provided");
    return res.status(400).json({ error: "A valid URL is required." });
  }

  if (shortcode && !validateShortCode(shortcode)) {
    logger(
      "warn",
      "backend",
      "controller",
      "Invalid custom shortcode provided"
    );
    return res.status(400).json({ error: "Invalid custom shortcode format." });
  }

  try {
    let finalShortCode = shortcode;
    if (shortcode) {
      const existing = await Url.findOne({ shortCode: shortcode });
      if (existing) {
        logger(
          "warn",
          "backend",
          "controller",
          "Custom shortcode already exists"
        );
        return res
          .status(409)
          .json({ error: "Custom shortcode is already in use." });
      }
    } else {
      finalShortCode = generateShortCode();
    }

    const validityMinutes = validity ? parseInt(validity, 10) : 30;
    const expiresAt = getExpirationDate(validityMinutes);

    const newUrl = new Url({
      originalUrl: url,
      shortCode: finalShortCode,
      expiresAt,
    });

    await newUrl.save();
    logger(
      "info",
      "backend",
      "controller",
      `New short URL created: ${finalShortCode}`
    );

    res.status(201).json({
      shortLink: getFullShortUrl(finalShortCode),
      expiresAt,
    });
  } catch (error: any) {
    logger(
      "error",
      "backend",
      "controller",
      `Error creating short URL: ${error.message}`
    );
    res.status(500).json({ error: "Internal server error." });
  }
};

export const redirectToUrl = async (req: Request, res: Response) => {
  const { shortcode } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortCode: shortcode });

    if (!urlEntry) {
      logger(
        "warn",
        "backend",
        "controller",
        `Shortcode not found: ${shortcode}`
      );
      return res.status(404).json({ error: "Short URL not found." });
    }

    if (new Date() > urlEntry.expiresAt) {
      logger(
        "warn",
        "backend",
        "controller",
        `Expired shortcode used: ${shortcode}`
      );
      return res.status(404).json({ error: "Short URL has expired." });
    }

    const ip = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const referrer = req.headers["referer"] || "unknown";
    const location = await getIpInfo(ip);

    urlEntry.clickCount += 1;
    urlEntry.clicks.push({
      timestamp: new Date(),
      ip,
      userAgent,
      referrer,
      location,
    });

    await urlEntry.save();
    logger(
      "info",
      "backend",
      "controller",
      `Redirecting ${shortcode} to ${urlEntry.originalUrl}`
    );

    res.redirect(302, urlEntry.originalUrl);
  } catch (error: any) {
    logger(
      "error",
      "backend",
      "controller",
      `Error redirecting URL: ${error.message}`
    );
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getUrlStats = async (req: Request, res: Response) => {
  const { shortcode } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortCode: shortcode });

    if (!urlEntry) {
      logger(
        "warn",
        "backend",
        "controller",
        `Statistics requested for non-existent shortcode: ${shortcode}`
      );
      return res.status(404).json({ error: "Short URL not found." });
    }

    logger(
      "info",
      "backend",
      "controller",
      `Statistics retrieved for ${shortcode}`
    );
    res.status(200).json({
      originalUrl: urlEntry.originalUrl,
      createdAt: urlEntry.createdAt,
      expiresAt: urlEntry.expiresAt,
      clickCount: urlEntry.clickCount,
      clicks: urlEntry.clicks,
    });
  } catch (error: any) {
    logger(
      "error",
      "backend",
      "controller",
      `Error getting URL stats: ${error.message}`
    );
    res.status(500).json({ error: "Internal server error." });
  }
};
