import React, { useState } from 'react'
import { auth, db } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useNavigate, Link, useLocation } from 'react-router-dom'

const Login = () => {
  // setting multiple state values, use with e.target.name attribute
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
  })
  // useNavigate to redirect to home page
  const navigate = useNavigate()
  // useLocation to get the current location
  const location = useLocation()
  // destructure default values from the useState getter
  const { email, password, error, loading } = values
  // { ...values, [e.target.name]: e.target.value } : This is an object that is passed to setValues. The ...values part is using the spread operator to create a new object with the same properties as the current values state.
  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value })

  // console.log(location)

  // handleSubmit function is an async function that takes an event object as an argument. The event object is passed to the function when the form is submitted. The function prevents the default form submission behavior by calling e.preventDefault()
  const handleSubmit = async e => {
    e.preventDefault()
    // validate fields
    if (!email || !password) {
      setValues({ ...values, error: 'All fields are required' })
      return
    }
    // before making the request, clear error message and set loading to true
    setValues({ ...values, error: '', loading: true })

    try {
      // register user
      const result = await signInWithEmailAndPassword(auth, email, password)
      // update user document in firestore
      await updateDoc(doc(db, 'users', result.user.uid), {
        isOnline: true,
      })
      // clear state, setValues back to default
      setValues({
        email: '',
        password: '',
        error: '',
        loading: false,
      })
      // if location.state?.from is true, navigate to the previous page, else navigate to home page
      if (location.state?.from) {
        navigate(location.state.from.pathname)
      } else {
      // redirect to home page, replace: true will remove the history entry so the user can't go back to the login page
      navigate('/', { replace: true })
      }
      // error handling ...values will return an object with the current values state, the error property is set to the error message.
    } catch (error) {
      setValues({ ...values, error: error.message, loading: false })
    }
  }
  return (
    <form className='shadow rounded p-3 mt-5 form' onSubmit={handleSubmit}>
      <h3 className='text-center mb-3'>Log Into Your Account</h3>
      <div className='mb-3'>
        <label htmlFor='email' className='form-label'>
          Email
        </label>
        <input
          type='email'
          className='form-control'
          name='email'
          value={email}
          onChange={handleChange}
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          type='password'
          className='form-control'
          name='password'
          value={password}
          onChange={handleChange}
        />
      </div>
      {/* display error message if error is not null */}
      {error ? <p className='text-center text-danger'>{error}</p> : null}
      <div className='text-center mb-3'>
        <button className='btn btn-secondary btn-sm' disabled={loading}>
          Login
        </button>
      </div>
      <div className='text-center mb-3'>
        <small>
          <Link to='/auth/forgot-password'>Forgot Password</Link>
        </small>
      </div>
    </form>
  )
}

export default Login
