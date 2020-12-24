import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListner } from './events/Ticket-created-listener'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('Nats connection closed')
    process.exit()
  })

  new TicketCreatedListner(stan).listen()
})

// Close stan when received termination or interupt signals
process.on('SIGTERM', () => stan.close())
process.on('SIGINT', () => stan.close())
