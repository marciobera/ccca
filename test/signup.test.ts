import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;


beforeEach(() => {
    // const accountDAO = new AccountDAODatabase();
    const accountDAO = new AccountDAOMemory();
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
})

test("Should create a passanger account", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
    }
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
})

test("Should create a driver account", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isDriver: true,
        carPlate: "ABC1234"
    }
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
    expect(outputGetAccount.car_plate).toBe(input.carPlate);
})

test("Sound not create a passanger if the name is invalid", async () => {
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
    }
    await expect(() => signup.execute(input)).rejects.toThrow("Invalid name");
})

test("Sound not create a passanger if the email is invalid", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        isPassenger: true,
    }
    await expect(() => signup.execute(input)).rejects.toThrow("Invalid email");
})

test("Sound not create a passanger if the cpf is invalid", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321559",
        isPassenger: true,
    }
    await expect(() => signup.execute(input)).rejects.toThrow("Invalid CPF");
})


test("Sound not create an account if the email already exists", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
    }
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow("Account already exists");
})

test("Sound not create a driver if the car plate is invalid", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isDriver: true,
        carPlate: "ABC123"
    }
    await expect(() => signup.execute(input)).rejects.toThrow("Invalid car plate");
})
