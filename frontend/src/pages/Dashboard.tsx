import { createClient } from "@/lib/client"
import type { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const supabase = createClient()


export default function Dashboard(){
    const navigate = useNavigate()
    const [users, setusers] = useState< User|null>(null)

    useEffect(()=>{
        async function getInfo (){
            const {data, error} = await supabase.auth.getUser()
            if(data.user){
                setusers(data.user)
            }
        }
        getInfo()
    },[])
    return <div>
        {!users && <button onClick={()=>{
            navigate("/auth")
        }}></button>}
        {users?.email}
    </div>
}