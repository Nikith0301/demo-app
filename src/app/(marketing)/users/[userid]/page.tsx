import React from 'react'

const page = async({params}:{params :Promise<{userid:string}> })=> 
    {

        const userId=(await params).userid;
       console.log(await params)
  return (
    <>
    <h1>Deatils about each user {userId}</h1>
    </>
  )
}

export default page