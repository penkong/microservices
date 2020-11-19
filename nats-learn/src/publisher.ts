import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', async () => {
  console.log('publisher conected to nats')

  const data = {
    id: '2343',
    title: 'concert',
    price: 20
  }

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish(data)
  } catch (error) {
    console.log(error)
  }
})
