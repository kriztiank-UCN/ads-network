import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebaseConfig'
import { useLocation, Link } from 'react-router-dom'
import MessageForm from '../components/MessageForm'
import User from '../components/User'

const Chat = () => {
  const [chat, setChat] = useState()
  const [text, setText] = useState('')
  const [users, setUsers] = useState([])

  const location = useLocation()
  // get the current logged in user's id
  const user1 = auth.currentUser.uid

  const getChat = async ad => {
    const buyer = await getDoc(doc(db, 'users', user1))
    const seller = await getDoc(doc(db, 'users', ad.postedBy))
    setChat({ ad, me: buyer.data(), other: seller.data() })
  }
  // get a list of all the users in the chat
  const getList = async () => {
    // create a reference to the messages collection in Firestore
    const msgRef = collection(db, 'messages')
    // create a query to get all the messages where the logged in user is in the users array
    const q = query(msgRef, where('users', 'array-contains', user1))

    const msgsSnap = await getDocs(q)
    // get all the messages from the query snapshot
    const messages = msgsSnap.docs.map(doc => doc.data())

    // So we will make three requests inside a for of loop.
    // To get the ad information based on ad ID and to get users information based on the IDs.

    // create an empty local array to store the users
    const users = []
    // loop through all the messages
    for (const message of messages) {
      // create a reference to the ads document and id
      const adRef = doc(db, 'ads', message.ad)
      // create a reference to the logged in user's document
      const meRef = doc(
        db,
        'users',
        // get the user id from the users array in the messages document
        message.users.find(id => id === user1)
      )
      // create a reference to the other user's document
      const otherRef = doc(
        db,
        'users',
        // get the other user id from the users array in the messages document
        message.users.find(id => id !== user1)
      )

      const adDoc = await getDoc(adRef)
      const meDoc = await getDoc(meRef)
      const otherDoc = await getDoc(otherRef)

      users.push({
        ad: adDoc.data(),
        me: meDoc.data(),
        other: otherDoc.data(),
      })
    }
    setUsers(users)
  }

  useEffect(() => {
    if (location.state?.ad) {
      getChat(location.state?.ad)
    }
    getList()
  }, [])

  // console.log(users)

  // store the chat inside a subcollection of the messages collection called chat
  const handleSubmit = async e => {
    e.preventDefault()
    // get the other user's id from the chat state
    const user2 = chat.other.uid
    const chatId =
      // compare the logged in user ID with the ad creator ID (who is logged in)
      user1 > user2
        ? // if its the logged in user, format the chatId as below
          `${user1}.${user2}.${chat.ad.adId}`
        : // if its the ad creator, format the chatId as below
          `${user2}.${user1}.${chat.ad.adId}`

    // create a chat subdocument in messages collection in Firestore
    await addDoc(collection(db, 'messages', chatId, 'chat'), {
      text,
      sender: user1,
      createdAt: Timestamp.fromDate(new Date()),
    })
    // clear the text form field
    setText('')
  }

  // console.log(chat)

  return (
    <div className='row'>
      <div className='col-2 col-md-4 users_container' style={{ borderRight: '1px solid #ddd' }}>
        {users.map((user, i) => (
          // pass the user object to User.js component
          <User key={i} user={user} />
        ))}
      </div>
      <div className='col-10 col-md-8 position-relative'>
        {chat ? (
          <>
            <div className='text-center mt-1' style={{ borderBottom: '1px solid #ddd' }}>
              {/* seller name */}
              <h3>{chat.other.name}</h3>
            </div>
            <div className='p-2' style={{ borderBottom: '1px solid #ddd' }}>
              <div className='d-flex align-items-center'>
                <img
                  src={chat.ad.images[0].url}
                  alt={chat.ad.title}
                  style={{ width: '50px', height: '50px' }}
                />
                <div className='d-flex align-items-center justify-content-between flex-grow-1 ms-1'>
                  <div>
                    <h6>{chat.ad.title}</h6>
                    <small>{chat.ad.price}</small>
                  </div>
                  <Link
                    className='btn btn-secondary btn-sm'
                    to={`/${chat.ad.category.toLowerCase()}/${chat.ad.adId}`}
                  >
                    View Ad
                  </Link>
                </div>
              </div>
            </div>
            {/* pass the text, setText and handleSubmit props to MessageForm.js */}
            <MessageForm text={text} setText={setText} handleSubmit={handleSubmit} />
          </>
        ) : (
          <div className='text-center mt-5'>
            <h3>Select a user to start conversation</h3>
          </div>
        )}
      </div>
    </div>
  )
}
export default Chat
