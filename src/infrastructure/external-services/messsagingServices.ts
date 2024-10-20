import amqp from 'amqplib';

export class MessagingService {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async connect(url: string): Promise<void> {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
    }

    async sendMessage(queue: string, message: string): Promise<void> {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message));
    }

    async receiveMessage(
        queue: string,
        callback: (msg: amqp.Message | null) => void,
    ): Promise<void> {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, callback, { noAck: true });
    }
}
