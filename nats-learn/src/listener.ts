import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('litener conected to nats')

  stan.on('close', () => {
    console.log('nats closed')
    process.exit()
  })

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('oreder-service')

  const subsc = stan.subscribe(
    'ticket:created',
    'order-service-queue-group',
    options
  )

  subsc.on('message', (msg: Message) => {
    // console.log(msg)
    console.log(msg.getSequence())

    const data = msg.getData()
    if (typeof data === 'string') {
      console.log(JSON.parse(data))
    }
    msg.ack()
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
