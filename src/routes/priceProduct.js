import { Router } from "express";
import { getProductPrice } from "../controllers/index.js";

const router = Router();

router.post("/product-price", getProductPrice);

export default router;
