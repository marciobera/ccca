import AccountRepository from "./AccountRepository";

export default class GetAccount {
    // Port
    constructor(readonly accountRepository: AccountRepository) { }

    async execute(accountId: string) {
        const account = await this.accountRepository.getById(accountId);
        if (!account) throw new Error("Account does not exist")
        return account;
    }
}
