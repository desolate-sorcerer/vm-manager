import express from "express";
import router from "./routes/machineRoutes.js"
import cors from "cors"
import http from "http"

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "OPTIONS"]
}));
app.use(router);

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
})
