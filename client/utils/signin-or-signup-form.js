const form = ({
  handleSubmit,
  name,
  email,
  setEmail,
  password,
  setPassword,
  errors,
}) => {
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col col-md-9'>
          <div className='form' onSubmit={handleSubmit}>
            <h1 className='text-center'>{name}</h1>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-control'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-control'
              />
              <small className='text-warning'>
                password must atleast 5 characters
              </small>
            </div>

            {errors}

            <button
              type='submit'
              className='btn btn-primary'
              onClick={handleSubmit}
            >
              {name}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default form
