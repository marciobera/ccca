import RideRepository from "./RideRepository";

export default class GetRide {
    constructor(readonly rideRepository: RideRepository) { }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.getById(rideId);
        if (!ride) throw new Error("Ride not found");
        return ride;
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
    date: Date
}
