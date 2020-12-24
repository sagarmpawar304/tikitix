const OrderIndex = ({ orders }) => {
  return (
    <div className='my-5'>
      <h1 className='mb-4'>My Orders</h1>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.status}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')
  return { orders: data }
}

export default OrderIndex
