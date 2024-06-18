import { useState, useEffect } from 'react'
import { Typography } from "@mui/material";
import { supabase } from "../api/index";
import SignUp from "./SignUp";
import Header from '../components/HeaderCard.jsx'

export default function App({children}) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <Header><Typography variant={'h6'}>Chargement ...</Typography></Header>
  } else if (!session) {
    return (<SignUp />)
  }
  else {
    return children
  }
}
