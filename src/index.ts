import { BasicTranslatorFactory } from "cn-poe-translator";
import express from "express";
import Assets from "cn-poe-export-db";
import bodyParser from 'body-parser';
import { Requester } from "./requester.js";
import { GetCharactersQuery } from "./types.js";

const port = 8005
const cookie = ""

const requester = new Requester(cookie)

const factory = new BasicTranslatorFactory(Assets);
const jsonTranslator = factory.getJsonTranslator();

const app = express()
app.use(bodyParser.json({ limit: '5mb' }))

app.get('/character-window/get-characters', (req, res) => {
    const query = req.query as any as GetCharactersQuery
    requester.getCharacters(query.accountName, query.realm).then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log("error: ", "get /character-window/get-characters: ", err)
        res.send("")
    })
})

app.get('/account/view-profile/*', (req, res) => {
    const slice = req.originalUrl.split("/")
    const accountName = slice[slice.length - 1]
    requester.viewProfile(accountName).then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log("error: ", "get /account/view-profile/*: ", err)
        res.send("")
    })
})

/**
 * Pob cannot recognize UTF8-encoded character names and treats character names as ASCII strings.
 */
function decodeUtf8Component(url: string): string {
    const bytes = Buffer.alloc(url.length);
    for (let i = 0; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        bytes[i] = charCode;
    }

    return bytes.toString("utf-8");
}

app.get('/character-window/get-passive-skills', (req, res) => {
    const urlObj = new URL(
        decodeUtf8Component(req.url),
        `http://${req.headers.host}`
    );
    const params = urlObj.searchParams;
    const accountName = params.get("accountName");
    const character = params.get("character");
    const realm = params.get("realm");
    requester.getPassiveSkills(accountName!, character!, realm!)
        .then((data) => {
            jsonTranslator.translatePassiveSkills(data);
            res.send(data)
        })
        .catch((err) => {
            console.log("error: ", "get /character-window/get-passive-skills: ", err)
            res.send("")
        })
})

app.get('/character-window/get-items', (req, res) => {
    const urlObj = new URL(
        decodeUtf8Component(req.url),
        `http://${req.headers.host}`
    );
    const params = urlObj.searchParams;
    const accountName = params.get("accountName");
    const character = params.get("character");
    const realm = params.get("realm");
    requester.getItems(accountName!, character!, realm!)
        .then((data) => {
            jsonTranslator.translateItems(data);
            res.send(data)
        })
        .catch((err) => {
            console.log("error: ", "get /character-window/get-items: ", err)
            res.send("")
        })
})

process.on('uncaughtException', err => {
    console.log('caught uncaught exception: ' + err)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
