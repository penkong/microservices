// -------------------------- Pacakges ------------------------

import { Publisher, Subjects, ITicketCreatedEvent } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
