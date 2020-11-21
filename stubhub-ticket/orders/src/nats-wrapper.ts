// ---------------- Packages -------------------------

import nats, { Stan } from 'node-nats-streaming'

// --------------- Local ---------------------------

// -----------------------------------------------------

class NatsWrapper {
  private _client?: Stan

  get client() {
    if (!this._client) throw new Error(' can not access nats before connection')
    return this._client
  }

  public connect(
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url })

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to Nats')
        resolve()
      })

      this.client.on('error', (err: any) => {
        reject(err)
      })
    })
  }
}

export const natsWrapper = new NatsWrapper()
