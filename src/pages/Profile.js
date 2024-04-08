import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage, auth } from '../firebaseConfig'
import { FaUserAlt, FaCloudUploadAlt } from 'react-icons/fa'
import moment from 'moment'

// format createdAt to month and year with moment.js
const monthAndYear = date =>
  `${moment(date).format('MMMM').slice(0, 3)} ${moment(date).format('YYYY')}`

const Profile = () => {
  // create state variables and set default values
  const { id } = useParams()
  const [user, setUser] = useState()
  const [img, setImg] = useState('')

  const getUser = async () => {
    // const docSnap = await getDoc(doc(db, 'users', id))
    // if (docSnap.exists()) {
    //   setUser(docSnap.data())
    // }
    // onSnapshot is a realtime listener that listens for changes to the document in the database
    const unsub = onSnapshot(doc(db, 'users', id), querySnapshot => setUser(querySnapshot.data()))

    return () => unsub()
  }

  const uploadImage = async () => {
    // create image reference, and make unique by adding Date.now() to the name
    const imgRef = ref(storage, `profile/${Date.now()} - ${img.name}`)
    // if user has a photo, delete it and upload new one
    if (user.photoUrl) {
      await deleteObject(ref(storage, user.photoPath))
    }
    // upload image
    const result = await uploadBytes(imgRef, img)
    // get download url
    const url = await getDownloadURL(ref(storage, result.ref.fullPath))
    // update user doc, auth.currentUser.uid is the current user's id
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      // URL is to display the image on our site.
      photoUrl: url,
      // fullPath is to delete the image from firebase storage
      photoPath: result.ref.fullPath,
    })
    // clear img state
    setImg('')
  }

  useEffect(() => {
    getUser()
    if (img) {
      uploadImage()
    }
  }, [img])

  const deletePhoto = async () => {
    const confirm = window.confirm('Delete photo permanently?')
    if (confirm) {
      await deleteObject(ref(storage, user.photoPath))
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoUrl: '',
        photoPath: '',
      })
    }
  }

  // if uder exists, display user info else return null
  return user ? (
    <div className='mt-5 container row'>
      <div className='text-center col-sm-2 col-md-3'>
        {/* if user has an image, then show the image, else show placeholder icon */}
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={user.name}
            style={{ widht: '100px', height: '100px', borderRadius: '50%' }}
          />
        ) : (
          <FaUserAlt size={50} />
        )}
        <div className='dropdown my-3 text-center'>
          <button
            className='btn btn-secondary btn-sm dropdown-toggle'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            Edit
          </button>
          <ul className='dropdown-menu'>
            <li>
              <label htmlFor='photo' className='dropdown-item'>
                <FaCloudUploadAlt size={30} /> Upload Photo
              </label>
              <input
                type='file'
                id='photo'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={e => setImg(e.target.files[0])}
              />
            </li>
            {user.photoUrl ? (
              <li className='dropdown-item btn' onClick={deletePhoto}>
                Remove Photo
              </li>
            ) : null}
          </ul>
        </div>
        <p>Member since {monthAndYear(user.createdAt.toDate())}</p>
      </div>
      <div className='col-sm-10 col-md-9'>
        <h3>{user.name}</h3>
        <hr />
      </div>
    </div>
  ) : null
}

export default Profile
