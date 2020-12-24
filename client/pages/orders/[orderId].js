import { useState, useEffect } from 'react'
import StripeCheckOut from 'react-stripe-checkout'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div className='my-5'>
      <h4>
        Time left to pay: <span className='text-warning'>{timeLeft}</span>
        seconds
      </h4>
      <StripeCheckOut
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51HsjpUIWTnOJIzlB4JEUzzL21dexdAfzhb5qmPaiHHVmQyu6iMPLQAjWYjcWg4ixNnGHcPYwrgYXY3gc3zPMpuBv00UXsWJff9'
        amount={order.ticket.price * 100}
        currency='INR'
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default OrderShow
