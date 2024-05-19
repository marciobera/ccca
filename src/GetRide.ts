import AccountRepository from "./AccountRepository";
import RideRepository from "./RideRepository";

export default class GetRide {
    constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository) { }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.getById(rideId);
        if (!ride) throw new Error("Ride not found");
        const passenger = await this.accountRepository.getById(ride.passengerId);
        if (!passenger) throw new Error("Passenger not found");
        return {
            passengerId: ride.passengerId,
            rideId: ride.rideId,
            fromLat: ride.fromLat,
            fromLong: ride.fromLong,
            toLat: ride.fromLat,
            toLong: ride.fromLong,
            status: ride.status,
            date: ride.date,
            passengerName: passenger.name,
        };
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
    passengerName: string,
}
