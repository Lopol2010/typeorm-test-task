import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors"
import * as axios from "axios"
import {createConnection} from "typeorm";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import * as path from "path";
import * as dotenv from "dotenv";


createConnection().then(async connection => {

    // create express app
    const app = express();

    dotenv.config()

    app.use(bodyParser.json());
    app.use(cors());

    app.use(express.static(__dirname + '/client'));

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => {
                        result !== null && result !== undefined ? res.send(result) : undefined
                    }).catch(err => { 
                        console.log(err) 
                        res.status(500).send({message: "Error during saving user"})
                    })
            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...
    app.get("/", (req: Request, res: Response, next: Function) => {

        res.sendFile(__dirname + "/client/index.html")

    })

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000 to see results");

}).catch(error => console.log(error));

function isDevelopment() {
    return process.env.NODE_ENV !== "production"
}