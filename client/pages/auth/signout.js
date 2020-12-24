import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import { useEffect } from 'react'

const signOut = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  })

  useEffect(() => {
    doRequest()
  }, [])
  return (
    <div className='text-center mt-5'>
      <h2 className='text-info'>Signing you out....</h2>
    </div>
  )
}

export default signOut
