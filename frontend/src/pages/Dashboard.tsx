import { createClient } from "@/lib/client"
import type { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { BACKEND_URL } from "@/lib/config"

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
    useEffect(()=>{
        async function getExistingConversations(){
            if(users){
                const { data :{session}} = await supabase.auth.getSession();
                const jwt = session?.access_token
                const res =  await axios.get(`${BACKEND_URL}/conversations `,{
                    headers:{
                        Authorization : jwt
                    }
                })
                console.log(res.data);
            } 
        }
        getExistingConversations()
    },[users])
    return <div>
        {!users && <button onClick={()=>{
            navigate("/auth")
        }}>signUp</button>}
        {users && <div>
            <button onClick={()=>{
                supabase.auth.signOut()
                setusers(null)
            }}>logOut</button>
        </div> }
        {users?.email}
    </div>
}