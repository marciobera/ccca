import crypto from "crypto";
import MailerGateway from "./MailerGateway";
import Account from "./Account";
import AccountRepository from "./AccountRepository";

// Use case
export default class Signup {
    // Port
    constructor(readonly accountRepository: AccountRepository, readonly mailerGatway: MailerGateway) { }

    async execute(input: any) {
        input.accountId = crypto.randomUUID();
        const existingAccount = await this.accountRepository.getByEmail(input.email);
        const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
        if (existingAccount) throw new Error("Account already exists");
        await this.accountRepository.save(account);
        await this.mailerGatway.send("Welcome", account.email, "User this link to confirm your account");
        return {
            accountId: account.accountId,
        };
    }
}