import Link from 'next/link';
import React from 'react'

interface User{
  id:number;
  name:String;
}

const userData=[{id:1,name:'pavan'},{id:2,name:'yash'},{id:3,name:'sai'}]

const UsersPage = async() => {
     const res=await fetch('https://jsonplaceholder.typicode.com/users');
      const users :User[]=await res.json();

      console.log(users)
 

  return (
    <>
     <div>UsersPage</div>

     {/* {users.map(user=><li key={user.id}>{user.name.split(' ')[0]}</li> )} */}
      {/* {users.map(user => (
  <Link key={user.id} href={`/users/${user.name.split(' ')[0]}`}>
    {user.name}
  </Link>

))} */}

        {userData.map(user=>(<li key={user.id} >{user.name}</li>) )}
    </>
   

  )
}

export default UsersPage