import React from 'react'

export default async function page({params}:{params:Promise<{slug:string[]}>}) {

    let {slug}=await params
    console.log("params are",slug)

 if(slug?.length==2) return (
    <>
  <h1>user docs for {slug[0]} has review on {slug[1]}</h1>
    
    </>
  )
  else{
    return  <h1>user docs for {slug[0]} </h1>
  }

}
