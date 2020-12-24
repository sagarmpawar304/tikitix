import Link from 'next/link'

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map((link, index) => {
      return (
        <li key={index} className='nav-item'>
          <Link href={link.href}>
            <a className='nav-link'>{link.label}</a>
          </Link>
        </li>
      )
    })
  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>TikiTix</a>
      </Link>
      <div className='d-flex justify-content-end'>
        <div className='nav d-flex align-items-center'>{links}</div>
      </div>
    </nav>
  )
}

export default Header
