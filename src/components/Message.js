import React, { useRef, useEffect } from 'react'
import Moment from 'react-moment'
// receive the message and the currently logged in user as props from chat.js component
const Message = ({ msg, user1 }) => {
  const scrollRef = useRef()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    // pass the scrollRef as a dependency to the useEffect hook so that the component will scroll to the bottom of the screen whenever a new message is received.
  }, [msg])

  return (
    <div
      // if the sender of the message is the currently logged in user, then the message will be displayed on the right side of the screen, otherwise it will be displayed on the left side of the screen.
      className={`mb-1 p-1 ${msg.sender === user1 ? 'text-end' : ''}`}
      // pass the scrollRef to the div element so that the component will scroll to the bottom of the screen whenever a new message is received.
      ref={scrollRef}
    >
      <p
      // if the sender of the message is the currently logged in user, then the background color of the message will be set to secondary, otherwise it will be set to gray.
        className={`p-2 ${msg.sender === user1 ? 'bg-secondary text-white' : 'gray'}`}
        style={{
          maxWidth: '50%',
          display: 'inline-block',
          borderRadius: '5px',
        }}
      >
        {msg.text}
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  )
}

export default Message
