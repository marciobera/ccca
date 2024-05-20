import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import HttpServer from "./HttpServer";
import RequestRide from "./RequestRide";
import Signup from "./Signup";

// Interface Adapter
export default class MainController {
    constructor(httpServer: HttpServer, signup: Signup, getAccount: GetAccount, requestRide: RequestRide, getRide: GetRide) {
        httpServer.register("post", "/signup", async (params: any, body: any) => {
            const output = await signup.execute(body);
            return output;
        });
        
        httpServer.register("get", "/accounts/:accountId", async (params: any, body: any) => {
            const output = await getAccount.execute(params.accountId);
            return output;
        });
        
        httpServer.register("post", "/request_ride", async (params: any, body: any) => {
            const output = await requestRide.execute(body);
            return output;
        });
        
        httpServer.register("get", "/rides/:rideId", async (params: any, body: any) => {
            const ride = await getRide.execute(params.rideId);
            return ride;
        });
    }
}