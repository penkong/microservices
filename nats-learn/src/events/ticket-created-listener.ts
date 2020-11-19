import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { ITicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subjects'

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName: string = 'payments-service'

  onMessage(data: ITicketCreatedEvent['data'], msg: Message): void {
    console.log('event data')
    // business logic

    msg.ack()
  }
}
