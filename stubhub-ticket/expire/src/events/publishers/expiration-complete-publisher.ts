// -------------------------- Pacakges ------------------------

import { Publisher, Subjects, IExpirationCompleteEvent } from '@baneeem/common'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

export class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
