import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material"
import { Postimerkki } from "./Etusivu"


interface Props {
    postimerkki: Postimerkki,
    idx: number
} 
export const PostimerkkiKortti: React.FC<Props> = (props: Props): React.ReactElement => {
    return (
        <Grid item xs={3} key={props.idx}>
            <Card>
                {(props.postimerkki.kuvanUrl)
                    ? <CardMedia
                        component="img"
                        height="140"
                        image={props.postimerkki.kuvanUrl}
                        alt="Postimerkin kuva"
                    />
                    : null
                }
                <CardContent>
                    <Typography sx={{ fontWeight: 'bold' }}>{props.postimerkki.merkinNimi}</Typography>
                    <Typography variant="body2">{`Nimellisarvo: ${props.postimerkki.nimellisarvo?.toFixed(2)} ${props.postimerkki.valuutta}${props.postimerkki.valuutta?.slice(-1)}`}</Typography>
                    <Typography variant="body2">{`Painettu (kpl): ${props.postimerkki.painosmaara}`}</Typography>
                    <Typography variant="body2">{`Taiteilija: ${props.postimerkki.taiteilija ? props.postimerkki.taiteilija : "Tuntematon"}`}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

