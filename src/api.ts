import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase } from "./AccountDAO";
import pgp from "pg-promise";
import RequestRide from "./RequestRide";
import { RideDAODatabase } from "./RideDAO";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO);
    const output = await signup.execute(req.body);
    res.json(output);
});

app.get("/accounts/:accountId", async (req, res) => {
    const accountDAO = new AccountDAODatabase();
    const output = await accountDAO.getById(req.params.accountId);
    res.json(output);
});

app.post("/request_ride", async (req, res) => {
    try {
        const accounntDAO = new AccountDAODatabase();
        const rideDAO = new RideDAODatabase();
        const requestRide = new RequestRide(rideDAO, accounntDAO);
        const output = await requestRide.execute(req.body);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/rides/:rideId", async (req, res) => {
    const rideDAO = new RideDAODatabase();
    const ride = await rideDAO.getById(req.params.rideId);
    res.json(ride);
});


app.listen(3000);
