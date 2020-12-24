import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const TicketShow = ({ ticket }) => {
  const { id, title, price } = ticket

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })
  return (
    <div className='my-5'>
      <h4>{title}</h4>
      <h4>Price: {price}</h4>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)
  return { ticket: data }
}

export default TicketShow
