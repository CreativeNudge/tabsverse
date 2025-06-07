'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugSupabase() {
  const [status, setStatus] = useState('Checking...')
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClient()
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setStatus(`Auth Error: ${error.message}`)
        } else {
          setStatus('Supabase connection working!')
        }
      } catch (err) {
        setStatus(`Connection Error: ${err}`)
      }
    }
    
    checkConnection()
  }, [])
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-sm z-50">
      Debug: {status}
    </div>
  )
}