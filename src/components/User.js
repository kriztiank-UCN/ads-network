import { FaUserCircle } from 'react-icons/fa'

const User = ({ user, selectUser, chat, online }) => {
  return user ? (
    <div
      className={`d-flex align-items-center justify-content-center justify-content-md-start my-2 p-1 ${
        user.ad.title === chat?.ad.title && user.other.name === chat?.other.name ? 'gray' : ''
      }`}
      onClick={() => selectUser(user)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {user.other.photoUrl ? (
        <img
          src={user.other.photoUrl}
          alt={user.other.name}
          style={{ width: '50', height: '50px', borderRadius: '50%' }}
        />
      ) : (
        <FaUserCircle size={50} />
      )}
      <span
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          top: 45,
          left: 35,
          borderRadius: '50%',
        }}
        // if the user is online, the span will have a green background, otherwise red
        className={`${online[user.other.uid] ? 'bg-success' : 'bg-danger'}`}
      ></span>
      <div className='d-none d-md-inline-block ms-2'>
        <h6>
          {user.other.name}
          <br />
          {user.ad.title}
        </h6>
      </div>
    </div>
  ) : null
}

export default User
