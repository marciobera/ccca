import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase } from "./AccountDAO";
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

app.listen(3000);
