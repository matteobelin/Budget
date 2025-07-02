import express from "express";
import loginRouter from "./login";
import signupRouter from "./signup";
import logOutRouter from "./logout"
import redisRateLimiter from "../../middleware/redisRateLimiter";

const router = express.Router();

router.use(redisRateLimiter);

router.use(loginRouter);
router.use(signupRouter);
router.use(logOutRouter)

export default router;