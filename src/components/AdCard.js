import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHeart } from 'react-icons/ai'
import Moment from 'react-moment'
// recieve ad as a prop from parent component and destructure it
const AdCard = ({ ad }) => {
  // create a dynamic link for each ad
  const adLink = `/${ad.category.toLowerCase()}/${ad.id}`
  return (
    <div className='card'>
      <Link to={adLink}>
        <img
          src={ad.images[0].url}
          alt={ad.title}
          className='card-img-top'
          style={{ width: '100%', height: '200px' }}
        />
      </Link>
      <div className='card-body'>
        <p className='d-flex justify-content-between align-items-center'>
          <small>{ad.category}</small>
          <AiOutlineHeart size={30} />
        </p>
        <Link to={adLink}>
          <h5 className='card-title'>{ad.title}</h5>
        </Link>
        <Link to={adLink}>
          <p className='card-text'>
            {ad.location} - <Moment fromNow>{ad.publishedAt.toDate()}</Moment>
            <br />
            Price. {Number(ad.price).toLocaleString()}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default AdCard
