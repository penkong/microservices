// -------------------------- Pacakges ------------------------

import { Publisher, Subjects, ITicketUpdatedEvent } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
