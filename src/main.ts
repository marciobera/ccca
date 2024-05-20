import Signup from "./Signup";
import { AccountRepositoryDatabase } from "./AccountRepository";
import RequestRide from "./RequestRide";
import { RideRepositoryDatabase } from "./RideRepository";
import { MailerGatewayConsole } from "./MailerGateway";
import GetRide from "./GetRide";
import GetAccount from "./GetAccount";
import { PgPromiseAdapter } from "./DatabaseConnection";
import { ExpressAdapter } from "./HttpServer";
import MainController from "./MainController";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const mailerGatway = new MailerGatewayConsole();
const signup = new Signup(accountRepository, mailerGatway);
const getAccount = new GetAccount(accountRepository);
const rideRepository = new RideRepositoryDatabase(connection);
const requestRide = new RequestRide(rideRepository, accountRepository);
const getRide = new GetRide(rideRepository, accountRepository);
new MainController(httpServer, signup, getAccount, requestRide, getRide);
httpServer.listen(3000);