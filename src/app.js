import express from "express";
import cors from "cors";
import productRoutes from "./routes/priceProduct.js";

const app = express();

const PORT = process.env.PORT;

// We use the json spaces setting to add indentation and line breaks to the JSON response.
app.set("json spaces", 2);

// middlewares
app.use(cors({ origin: process.env.WEB_APPLICATION_CORS_ORIGIN }));
app.use(express.json());

app.use(productRoutes);

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});
