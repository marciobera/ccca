import axios from "axios";
axios.defaults.validateStatus = () => true;

test("Should create a passanger account", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("Should request a ride", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.rideId).toBeDefined();
    const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
    const outputGetRide = responseGetRide.data;
    expect(responseRequestRide.status).toBe(200);
    expect(outputGetRide.passenger_id).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.ride_id).toBe(outputRequestRide.rideId);
    expect(outputGetRide.from_lat).toBe(inputRequestRide.fromLat.toString());
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.date).toBeDefined();
});

test("Should not request a ride if account is not a passanger", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA9999",
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe("Account is not from a passenger");
});

test("Should not request a ride if passanger have an active ride", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe("Passenger has an active ride");
});
