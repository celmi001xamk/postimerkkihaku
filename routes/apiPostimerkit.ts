import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittelija";

const prisma: PrismaClient = new PrismaClient();

export const apiPostimerkitRouter: express.Router = express.Router();

apiPostimerkitRouter.use(express.json());

interface Postimerkki {
    id: number,
    asiasanat?: string,
    ilmestymispaiva?: string,
    kaytonPaattyminen?: string,
    nimellisarvo?: number,
    merkinNimi?: string,
    merkinVari?: string,
    painopaikka?: string,
    painosmaara: number,
    taiteilija?: string,
    valuutta?: string,
    kuvanUrl?: string
}

apiPostimerkitRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (typeof req.query.hakusana === "string" && String(req.query.hakusana).length > 0) {

            let hakusana1: string = `${req.query.hakusana} %`
            let hakusana2: string = `% ${req.query.hakusana}`
            let hakusana3: string = `% ${req.query.hakusana} %`
            let hakusana4: string = `${req.query.hakusana}`

            let hakukohde: string = `${req.query.hakukohde}`

            let postimerkit : Postimerkki[] = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE
                                                        ${Prisma.raw(hakukohde)} LIKE ${hakusana1} OR
                                                        ${Prisma.raw(hakukohde)} LIKE ${hakusana2} OR
                                                        ${Prisma.raw(hakukohde)} LIKE ${hakusana3} OR 
                                                        ${Prisma.raw(hakukohde)} LIKE ${hakusana4}`

            let minVuosi: number = Number(String(req.query.vuodet).split("-")[0]);
            let maxVuosi: number = Number(String(req.query.vuodet).split("-")[1]);

            postimerkit = postimerkit.filter(postimerkki => minVuosi <= Number(String(postimerkki.ilmestymispaiva).slice(-4)) &&
                                                maxVuosi >= Number(String(postimerkki.ilmestymispaiva).slice(-4)))

            res.json(postimerkit);
        } else {
            next(new Virhe(400))
        }
    } catch (e: any) {
        next(new Virhe());
    }
})

