import express from "express";
import Signup from "./Signup";
import { AccountRepositoryDatabase } from "./AccountRepository";
import pgp from "pg-promise";
import RequestRide from "./RequestRide";
import { RideRepositoryDatabase } from "./RideRepository";
import { MailerGatewayConsole } from "./MailerGateway";
import GetRide from "./GetRide";
import GetAccount from "./GetAccount";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const accountRepository = new AccountRepositoryDatabase();
    const mailerGatway = new MailerGatewayConsole();
    const signup = new Signup(accountRepository, mailerGatway);
    const output = await signup.execute(req.body);
    res.json(output);
});

app.get("/accounts/:accountId", async (req, res) => {
    const accountRepository = new AccountRepositoryDatabase();
    const getAccount = new GetAccount(accountRepository);
    const output = await getAccount.execute(req.params.accountId);
    res.json(output);
});

app.post("/request_ride", async (req, res) => {
    try {
        const accounntRepository = new AccountRepositoryDatabase();
        const rideRepository = new RideRepositoryDatabase();
        const requestRide = new RequestRide(rideRepository, accounntRepository);
        const output = await requestRide.execute(req.body);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/rides/:rideId", async (req, res) => {
    const rideRepository = new RideRepositoryDatabase();
    const accounntRepository = new AccountRepositoryDatabase();
    const getRide = new GetRide(rideRepository, accounntRepository);
    const ride = await getRide.execute(req.params.rideId);
    res.json(ride);
});


app.listen(3000);
