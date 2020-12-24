import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = (e) => {
    e.preventDefault()
    doRequest()
    setTitle('')
    setPrice('')
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) return
    setPrice(value.toFixed(2))
  }

  return (
    <div className='my-5'>
      <h1 className='text-center mb-4'>Create a Ticket</h1>
      <div className='row justify-content-center'>
        <div className='col col-lg-9'>
          <form className='form' onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='form-control'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='title'>Price</label>
              <input
                value={price}
                onBlur={onBlur}
                onChange={(e) => setPrice(e.target.value)}
                className='form-control'
              />
            </div>

            {errors}

            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewTicket
