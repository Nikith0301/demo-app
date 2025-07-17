import React from 'react'

export default async function page({params}:{params :Promise<{userid:string,reviewid: string}>} ) {
  
  const {userid,reviewid}= await  params;

    return (
    <>
    <h2>{reviewid} review for user- {userid}</h2>
    </>
  )
}
