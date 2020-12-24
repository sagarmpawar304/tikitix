import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import form from '../../utils/signin-or-signup-form'

const signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    doRequest()
    setEmail('')
    setPassword('')
  }

  return form({
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    name: 'Sign In',
  })
}

export default signup
