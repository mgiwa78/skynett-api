import redisClient from "@config/redis-client";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

export const apiRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
