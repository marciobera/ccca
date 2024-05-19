import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase } from "./AccountDAO";
import crypto from "crypto";
import pgp from "pg-promise";

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
    const rideId = crypto.randomUUID();
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query("select * from ccca.account where account_id = $1", [req.body.passengerId]);
    if (!account.is_passenger) {
        await connection.$pool.end();
        return res.status(422).json({ message: "Account is not from a passenger" });
    }
    const [activeRide] = await connection.query("select * from ccca.ride where passenger_id = $1 and status = 'requested'", [req.body.passengerId]);
    if (activeRide) {
        await connection.$pool.end();
        return res.status(422).json({ message: "Passenger has an active ride" });
    }
    await connection.query("insert into ccca.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [rideId, req.body.passengerId, req.body.fromLat, req.body.fromLong, req.body.toLat, req.body.toLong, "requested", new Date()]);
    await connection.$pool.end();
    res.json({ rideId });
});

app.get("/rides/:rideId", async (req, res) => {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [ride] = await connection.query("select * from ccca.ride where ride_id = $1", [req.params.rideId]);
    await connection.$pool.end();
    res.json(ride);
});


app.listen(3000);
