import { FaUserCircle } from 'react-icons/fa'

const User = ({ user }) => {
  return user ? (
    <div className='d-flex align-items-center justify-content-center justify-content-md-start my-2 p-1'>
      {user?.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={user.name}
          style={{ width: '50', height: '50px', borderRadius: '50%' }}
        />
      ) : (
        <FaUserCircle size={50} />
      )}
      <div className='d-none d-md-inline-block ms-2'>
        <h6>
          {user?.other.name}
          <br />
          {user?.ad.title}
        </h6>
      </div>
    </div>
  ) : null
}

export default User
