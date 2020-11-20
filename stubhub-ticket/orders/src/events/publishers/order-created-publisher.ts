// -------------------------- Pacakges ------------------------

import { Publisher, Subjects, IOrderCreatedEvent } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

export class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
