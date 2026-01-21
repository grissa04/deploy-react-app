const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(googleClientId);

router.post("/google", async (req, res) => {
  const { tokenId } = req.body; // token sent from frontend

  try {
    if (!tokenId) {
      return res.status(400).json({ error: "Missing Google token" });
    }
    if (!googleClientId) {
      return res.status(500).json({ error: "Google client ID not configured" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // User doesn't exist - create new account
      user = new User({
        name,
        email,
        password: "GOOGLE_OAUTH",
        avatar: picture,
        provider: "google",
        googleId: sub,
      });
      await user.save();
    } else if (!user.googleId && sub) {
      // Link Google account if missing
      user.googleId = sub;
      user.provider = user.provider || "google";
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Google login failed" });
  }
});

module.exports = router;
