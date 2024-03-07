import { Router } from "express";
import { getProductPrice } from "../controllers/index.js";

const router = Router();

router.get("/product-price", getProductPrice);

export default router;
