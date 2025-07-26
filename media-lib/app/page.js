'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'


export default function UsersList() {
 const [users, setUsers] = useState([])
 useEffect(() => {
   async function fetchUsers() {
     const { data, error } = await supabase.from('users').select('*')
     if (error) console.error(error)
     else setUsers(data)
   }
   fetchUsers()
 }, [])
 return (
   <div>
     <h2 className="text-xl font-bold mb-2">Users</h2>
     <ul className="space-y-2">
       {users.map((u) => (
         <li key={u.id} className="p-2 bg-base-200 rounded">
           {u.username || 'N/A'}
         </li>
       ))}
     </ul>
   </div>
 )
}