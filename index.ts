import express from "express";
import { virhekastittelija } from "./errors/virhekasittelija";
import { apiPostimerkitRouter } from "./routes/apiPostimerkit";

const app: express.Application = express();

const port: number = Number(process.env.PORT) || 3108;

app.use("/api/postimerkit", apiPostimerkitRouter);

app.use(virhekastittelija);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
});

app.listen(port, () => {
    console.log(`Palvelin käynnistyi porttiin : ${port}`)
});