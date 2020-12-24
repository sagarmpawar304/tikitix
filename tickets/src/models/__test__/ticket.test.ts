import { Ticket } from '../ticket'

describe('For Ticket model', () => {
  test('Implements optimistic concurrency control', async (done) => {
    // Create a ticket
    const ticket = Ticket.build({
      title: 'concert',
      price: 10,
      userId: 'asddsf',
    })
    await ticket.save()

    // Fetch ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 15 })
    secondInstance!.set({ price: 20 })

    // Save first instance of ticket
    await firstInstance!.save()

    // // // Save second instanse of ticket and expect an error while saving
    try {
      await secondInstance!.save()
    } catch (error) {
      return done()
    }

    throw new Error('Shoud not reach this point')
  })

  test('increments version number on only multiple saves', async () => {
    let ticket
    ticket = Ticket.build({
      title: 'concert',
      price: 10,
      userId: 'asddsf',
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
  })
})
