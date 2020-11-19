import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('publisher conected to nats')

  const data = JSON.stringify({
    id: '2343',
    title: 'concert',
    price: 20
  })

  stan.publish('ticket:created', data, (err, g) => {
    console.log('event published')
  })
})
