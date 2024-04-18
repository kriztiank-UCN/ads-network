import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const useSnapshot = (collection, docId) => {
  const [val, setVal] = useState()

  useEffect(() => {
    const docRef = doc(db, collection, docId)
    // onSnapshot is a realtime listener that listens for changes to the document in the database
    const unsub = onSnapshot(docRef, doc => setVal(doc.data()))

    return () => unsub()
  }, [])

  return { val }
}

export default useSnapshot
