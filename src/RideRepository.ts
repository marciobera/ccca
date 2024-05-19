import pgp from "pg-promise";
import Ride from "./Ride";

// Port
export default interface RideRepository {
    save(ride: Ride): Promise<void>;
    getById(rideId: string): Promise<Ride | undefined>;
    getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
}

// Adapter Database
export class RideRepositoryDatabase implements RideRepository {
    async save(ride: Ride) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date]);
        await connection.$pool.end();
    }

    async getById(rideId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [ride] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        if (!ride) return;
        return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date);
    }

    async getActiveRidesByPassengerId(passengerId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const activeRidesData = await connection.query("select * from ccca.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
        await connection.$pool.end();
        const activeRides: Ride[] = [];
        for (const activeRideData of activeRidesData) {
            activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, parseFloat(activeRideData.from_lat), parseFloat(activeRideData.from_long), parseFloat(activeRideData.to_lat), parseFloat(activeRideData.to_long), activeRideData.status, activeRideData.date))
        }
        return activeRides;
    }
}
