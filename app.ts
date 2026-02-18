import express from "express";
import "dotenv/config";
import authRoute from "./src/routes/auth.route";
import halaqahRoute from "./src/routes/halaqah.route";
import santriRoute from "./src/routes/santri.route";
import { errorHandler } from "./src/middleware/error.handler";
import setoranRoute from "./src/routes/setoran.route";
import absensiRoutes from "./src/routes/absensi.route";
import displayRoute from "./src/routes/display.route";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/halaqah/auth", authRoute);
app.use("/api/halaqah", halaqahRoute);
app.use("/api/santri", santriRoute);
app.use("/api/setoran", setoranRoute);
app.use("/api/absensi", absensiRoutes);
app.use("/api/display", displayRoute);

app.use(errorHandler);

export default app;
