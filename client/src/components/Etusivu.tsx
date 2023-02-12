import React, { useRef, useState } from "react";
import { Alert, Button, Container, Grid, Paper,  FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider, Stack, TextField } from "@mui/material";
import { PostimerkkiKortti } from "./PostimerkkiKortti"


export interface Postimerkki {
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
};

const marks = [
    {
        value: 1860,
        label: "1860"
    },
    {
        value: 1900,
        label: "1900"
    },
    {
        value: 1950,
        label: "1950"
    },
    {
        value: 2000,
        label: "2000"
    },
    {
        value: 2016,
        label: "2016"
    }
];

export const Etusivu: React.FC = (): React.ReactElement => {

    const lomakeRef = useRef<any>();

    const [postimerkit, setPostimerkit] = useState<any[]>([]);
    const [virhe, setVirhe] = useState<string>("")
    const [vuodet, setVuodet] = useState<number[]>([1860, 2016]);

    const sliderKasittelija = (event: Event, uusiArvo: number | Number[]) => {
        setVuodet(uusiArvo as number[]);
    }
    
    const haePostimerkkeja = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            let url: string = `api/postimerkit/?hakusana=${lomakeRef.current.hakusana.value}&hakukohde=${lomakeRef.current.hakuKohde.value}&vuodet=${vuodet[0]}-${vuodet[1]}`;
            const yhteys = await fetch(url);

            if (yhteys.ok) {
                if (lomakeRef.current.hakusana.value.length >= 2) {
                    let postimerkit = await yhteys.json();
                    if (postimerkit.length === 0) {
                        setVirhe(`Hakusanalla [${lomakeRef.current.hakusana.value}] ei löytynyt yhtään postimerkkiä`)
                    } else {
                        setPostimerkit(postimerkit);
                        setVirhe("");
                    }
                } else {
                    setVirhe("Hakusanan tulee olla vähintään 2 merkkiä pitkä.")
                }


            } else {
                switch (yhteys.status) {
                    case 400: setVirhe("Virheellinen asiasana"); break;
                    default: setVirhe("Palvelimella tapahtui virhe"); break;
                }
            }
        } catch (e: any) {
            setVirhe("Palvelimeen ei saada yhteyttä")
        }
    }


    return (
        <Container maxWidth="lg">
            <Paper
                component="form"
                onSubmit={haePostimerkkeja}
                ref={lomakeRef}
                sx={{ p: 3 }}
            >
                <Stack spacing={2}>

                    <Grid container spacing={1}>

                        <Grid item xs={10}>

                            <TextField
                                name="hakusana"
                                variant="outlined"
                                size="small"
                                fullWidth={true}
                                placeholder="Hae asiasanalla..."
                            />

                        </Grid>
                        <Grid item xs={2}>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth={true}
                            >Hae</Button>

                        </Grid>
                    </Grid>
                    <FormControl>
                        <FormLabel>Haun kohde</FormLabel>
                        <RadioGroup
                            row
                            name="hakuKohde"
                            defaultValue="asiasanat"
                        >
                            <FormControlLabel value="asiasanat" control={<Radio />} label="Asiasanat" />
                            <FormControlLabel value="merkinNimi" control={<Radio />} label="Merkin nimi" />
                            <FormControlLabel value="taiteilija" control={<Radio />} label="Taiteilija" />
                        </RadioGroup>
                    </FormControl>
                    <Slider
                        value={vuodet}
                        onChange={sliderKasittelija}
                        valueLabelDisplay="auto"
                        min={1860}
                        max={2016}
                        marks={marks}
                        step={1}
                    />
                </Stack>

            </Paper>

            {(Boolean(virhe))
                ? <Alert severity="error">{virhe}</Alert>
                : <Grid container spacing={2} sx={{ p: 1 }}>{postimerkit.map((postimerkki: Postimerkki, idx: number) => {
                    if (idx > 40) return;
                    if (idx === 40) {
                        return <Alert severity="error" sx={{ mt: 2 }} key={idx}>
                            Haulla löytyi yli 40 postimerkkiä, näytetään vain ensimmäiset 40. Ole hyvä ja tarkenna hakua.
                        </Alert> 
                    } else {
                        return <PostimerkkiKortti postimerkki={postimerkki} idx={idx} key={idx}/>
                    }
                })}</Grid>
            }

        </Container>
    );
};
