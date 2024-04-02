import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'

const Navbar = () => {
  // destructure the user object from the AuthContext
  const { user } = useContext(AuthContext)

  return (
    <nav className='navbar navbar-expand-md bg-light navbar-light sticky-top shadow-sm'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
          Ads Network
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
            {user ? (
              // if the user is logged in, display a log out button
              <>
                <button className='btn btn-danger btn-sm'>Log out</button>
              </>
            ) : (
              // if the user is not logged in, display a register and login link
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/auth/register'>
                    Register
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/auth/login'>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
