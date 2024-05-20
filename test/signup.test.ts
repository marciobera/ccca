import sinon from "sinon";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../src/AccountRepository";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";
import MailerGateway from "../src/MailerGateway";
import DatabaseConnection, { PgPromiseAdapter } from "../src/DatabaseConnection";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    // const accountRepository = new AccountRepositoryMemory();
    const mailerGatway: MailerGateway = {
        async send(subject: string, recipient: string, message: string) { }
    }
    signup = new Signup(accountRepository, mailerGatway);
    getAccount = new GetAccount(accountRepository);
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
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
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
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
    expect(outputGetAccount.carPlate).toBe(input.carPlate);
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

// test("Should create a passanger account [stub]", async () => {
//     const input = {
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "97456321558",
//         isPassenger: true,
//     }

//     const saveStub = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
//     const getByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves();
//     const getByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(input);

//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.cpf).toBe(input.cpf);
//     saveStub.restore();
//     getByEmailStub.restore();
//     getByIdStub.restore();
// })

// test("Should create a passanger account [spy]", async () => {
//     const input = {
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "97456321558",
//         isPassenger: true,
//     }

//     const saveSpy = sinon.spy(AccountRepositoryDatabase.prototype, "save");
//     const sendSpy = sinon.spy(MailerGateway.prototype, "send");

//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.cpf).toBe(input.cpf);
//     expect(saveSpy.calledOnce).toBe(true);
//     expect(saveSpy.calledWith(input)).toBe(true);
//     expect(sendSpy.calledOnce).toBe(true);
//     expect(sendSpy.calledWith("Welcome", input.email, "User this link to confirm your account")).toBe(true);
//     saveSpy.restore();
//     sendSpy.restore();
// })

// test("Should create a passanger account [mock]", async () => {
//     const input = {
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "97456321558",
//         isPassenger: true,
//     }

//     const mailerGatwayMock = sinon.mock(MailerGateway.prototype);
//     mailerGatwayMock.expects("send").withArgs("Welcome", input.email, "User this link to confirm your account").once();

//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.cpf).toBe(input.cpf);
//     mailerGatwayMock.verify();
//     mailerGatwayMock.restore();
// })

afterEach(async () => {
    await connection.close();
})