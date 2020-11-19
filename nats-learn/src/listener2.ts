import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('litener conected to nats')
  const subsc = stan.subscribe('ticket:created')
  subsc.on('message', (msg: Message) => {
    // console.log(msg)
    console.log(msg.getSequence())
    const data = msg.getData()
    if (typeof data === 'string') {
      console.log(JSON.parse(data))
    }
  })
})
