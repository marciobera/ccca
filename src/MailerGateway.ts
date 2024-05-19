export default class MailerGateway {
    send(subject: string, recipient: string, message: string) {
        console.log(subject, recipient, message)
    }
}
