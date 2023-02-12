import express from "express";

export class Virhe extends Error {
    status: number

    constructor(status?: number) {
        super();
        this.status = status || 500;
    }
}

export const virhekastittelija = (err: Virhe, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status).json({});
    next();
}