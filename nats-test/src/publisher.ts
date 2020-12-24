import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticked-created-publisher'

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

console.clear()

stan.on('connect', async () => {
  console.log('Publisher connected to the NATS')

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '1234',
      title: 'live concert',
      price: 30,
    })
  } catch (error) {
    console.log(error)
  }
})
