import express from "express";
import axios from "axios";
import jwt from 'jsonwebtoken';
import User from "../schema/userSchema.js";

const router = express.Router();

router.post("/auth", async (req, res) => {
  const { authorization } = req.headers;
  const [, code] = authorization.split(" ");
  const tokenRequestData = {
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URIS,
    grant_type: "authorization_code",
  };
  try {
    const tokenResponse = await axios.post(
      process.env.GOOGLE_TOKEN_URI,
      tokenRequestData
    );
    const { id_token } = tokenResponse.data;
    const decodedToken = jwt.decode(id_token, { complete: true });
    const {
      name: user_name,
      email: user_email,
      sub: user_sub,
    } = decodedToken.payload;

    const jwtPayload = {
      sub: user_sub,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      email: user_email,
    };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, {
      algorithm: "HS256",
    });

    const existingUser = await User.findOne({ userID: user_sub });
    if (!existingUser) {
      await User.create({
        email: user_email,
        userID: user_sub,
        user_name: user_name,
      });
    }

    res.status(200).json({
      jwt_token: jwtToken,
      user_name: user_name,
      user_email: user_email,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Authorization failed" });
  }
});

export { router as authRoutes };
