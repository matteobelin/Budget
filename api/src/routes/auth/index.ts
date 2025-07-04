import express from "express";
import loginRouter from "./login";
import signupRouter from "./signup";
import logOutRouter from "./logout"
import redisRateLimiter from "../../middleware/redisRateLimiter";

const router = express.Router();

router.use(logOutRouter)

router.use(redisRateLimiter,loginRouter);
router.use(redisRateLimiter,signupRouter);

export default router;