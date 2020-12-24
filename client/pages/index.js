import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    const { id, title, price } = ticket
    return (
      <tr key={id}>
        <td>{title}</td>
        <td>{price}</td>
        <td>
          <Link href='tickets/[ticketId]' as={`/tickets/${id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })
  return (
    <div className='my-5'>
      <h1 className='mb-4'>Tickets</h1>
      <table className='table'>
        <thead className='thead-dark'>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')
  return { tickets: data }
}

export default LandingPage
