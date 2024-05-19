import express from "express";
import Signup from "./Signup";
import { AccountRepositoryDatabase } from "./AccountRepository";
import pgp from "pg-promise";
import RequestRide from "./RequestRide";
import { RideRepositoryDatabase } from "./RideRepository";
import { MailerGatewayConsole } from "./MailerGateway";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const accountDAO = new AccountRepositoryDatabase();
    const mailerGatway = new MailerGatewayConsole();
    const signup = new Signup(accountDAO, mailerGatway);
    const output = await signup.execute(req.body);
    res.json(output);
});

app.get("/accounts/:accountId", async (req, res) => {
    const accountDAO = new AccountRepositoryDatabase();
    const output = await accountDAO.getById(req.params.accountId);
    res.json(output);
});

app.post("/request_ride", async (req, res) => {
    try {
        const accounntDAO = new AccountRepositoryDatabase();
        const rideDAO = new RideRepositoryDatabase();
        const requestRide = new RequestRide(rideDAO, accounntDAO);
        const output = await requestRide.execute(req.body);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/rides/:rideId", async (req, res) => {
    const rideDAO = new RideRepositoryDatabase();
    const ride = await rideDAO.getById(req.params.rideId);
    res.json(ride);
});


app.listen(3000);
