import express, { Request, Response, NextFunction, request, response } from "express";
import { DateTime } from "luxon";
import dati from "./data";

const port = 3000;
const app = express();

//configurazione template engine
app.set("views", "./src/views");
app.set("view engine", "hbs");

//express funziona in modalità "middleware" 
//questo middleware vale per tutte le richieste
//le middleware vengono lette dall'alto verso il basso a prescinere dal next()
app.use((req: Request, res: Response, next: NextFunction)=> {
    console.log("LOG:", req.method, req.url);
    //next manda avanti al prossimo
    next();
});

app.use((req: Request, res: Response, next: NextFunction)=> {
    const adesso = DateTime.local()
    if(adesso.month == 11 && adesso.day == 22){
        res.send("Black Friday")
    }
    next();
});

//per i file statici tipo le immagini usiamo questo per non dover fare una get per ogni file
app.use(express.static("./public"));

//MVC = Model View Controller

//questi middleware con get "filtrati" funziona solo con la barretta
app.get("/", (req: Request, res: Response)=> {
    //render sa dove prendere il file perchè glielo abbiamo detto in alto su app.set
    res.render("index", {nome: "Samuel"});
});

app.get("/chi-siamo", (req: Request, res: Response)=> {
    res.render("chi-siamo", {nome: "Chi Siamo"});
});

//invio html
app.get("/benvenuto", (req: Request, res: Response)=> {
    res.send("benvenuto");
});

app.get("/articoli", (req: Request, res: Response)=> {
    res.render("articoli", {pageTitle: "Lista Articoli", articoli: dati });
});

//simuliamo un errore 500 ma non si fa, è solo per vedere
app.get("/errore", (req: Request, res: Response)=> {
    throw new Error("Errore simulato") 
});


//accediamo ad un'articolo tramite id
app.get("/articoli/:id", (req: Request, res: Response)=> {

    const id = req.params["id"] //const id = request.params.id //è uguale
    //convertiamo in numero
    const idNumber = Number(id) //o si puo usare parseInt

    //se non va a buon fine perchè non trovo un numero
    if(isNaN(idNumber)){
        res.status(400).send("L'Id deve essere un numero.")
        return;
    }

    const articolo = dati.find(x => x.id == idNumber)

    //se non trova l'articolo
    if(!articolo){
        res.status(404).send("Articolo non trovato.")
        return;
    }
        
    res.render("articolo", {pageTitle: "Lista Articoli", articolo: articolo });
});


//invio Json
app.get("/api/pippo", (req: Request, res: Response)=> {
    res.json({ nome: "Pippo", anni: 50 });
});

//pagina non trovata //404
app.use((req: Request, res: Response ) =>{
    res.status(404).send("Pagina non trovata.")
})

//500 Globale
app.use((err: Error, req: Request, res: Response, next: NextFunction ) =>{
    console.log(err.message)
    res.status(500).send("Ops, qualcosa è andato storto:"+ err.message)
})






app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
    console.log("Premere CTRL+C per arrestare");
}) 