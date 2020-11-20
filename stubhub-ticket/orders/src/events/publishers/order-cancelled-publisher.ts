// -------------------------- Pacakges ------------------------

import { Publisher, Subjects, IOrderCancelledEvent } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

export class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
