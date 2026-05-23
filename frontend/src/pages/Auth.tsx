import { createClient } from '@/lib/client'
import React from 'react'

const supabase = createClient()

export default function Auth(){

    async function Login( provider : "github" | "google" ){
        const {data , error} = await supabase.auth.signInWithOAuth({
            provider:provider,
          })
    }

    return <div>
        <button onClick={()=> Login("github")}>login with github</button>
        <button onClick={()=> Login("google")}>login with google</button>
    </div>
}
