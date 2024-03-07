import express from "express";
import productRoutes from "./routes/priceProduct.js";

const app = express();

const PORT = 3000;

// We use the json spaces setting to add indentation and line breaks to the JSON response.
app.set("json spaces", 2);

// middlewares
app.use(express.json());

app.use(productRoutes);

app.listen(PORT, () => {
  console.log("Application started on port 3000!");
});
