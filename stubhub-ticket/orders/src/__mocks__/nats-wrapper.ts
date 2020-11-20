// -------------------------- Pacakges ------------------------

import { Stan } from 'node-nats-streaming'

// -------------------------- Local --------------------------

// -----------------------------------------------------------

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, cb: () => void) =>
        cb()
      )
  }
}
