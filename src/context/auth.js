import { createContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebaseConfig'
import Loading from '../components/Loading'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
// Create a new context
export const AuthContext = createContext()
// Create a new provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState([])

  // Track the user's login status
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user)
      // Set loading to false after the user's login status has been determined
      setLoading(false)

      if (user) {
        const msgRef = collection(db, 'messages')
        const q = query(msgRef, where('users', 'array-contains', user.uid))

        const unsub = onSnapshot(q, querySnapshot => {
          // Create an local array to store unread messages
          let unread = []
          querySnapshot.forEach(snap => {
            let data = snap.data()
            if (data.lastText && data.lastSender !== user.uid && data.lastUnread) {
              // push the unread messages to the local array
              unread.push({ ...data, id: snap.id })
            }
          })
          setUnread(unread)
        })
        return () => unsub()
      }
    })
  }, [])

  if (loading) {
    // if the user's login status is still being determined, display a loading spinner
    return <Loading />
  }
  // Pass the user's login status to the value prop of the provider, use aywhere in the app with useContext
  return <AuthContext.Provider value={{ user, unread }}>{children}</AuthContext.Provider>
}

export default AuthProvider
