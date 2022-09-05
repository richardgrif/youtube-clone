import Head from 'next/head'
import prisma from 'lib/prisma'
import Videos from 'components/Videos'
import Heading from 'components/Heading'
import LoadMore from 'components/LoadMore'
import { useState } from 'react'
import { getVideos } from 'lib/data'
import { amount } from 'lib/config'
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/react'

export default function Home({ initialVideos }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState(initialVideos)
  const [reachEnd, setReachedEnd] = useState(initialVideos.length < amount)
 
  const loading = status === 'loading'

  if (loading) {
    return null
  }

  if (session && !session.user.name) {
    router.push('/setup')
  }
  
  return (
    <div>
      <Heading />
      {videos.length === 0 && (
        <p className='flex justify-center mt-20'>No videos found!</p>
      )}
      <Videos videos={videos} />
      <LoadMore videos={videos} setVideos={setVideos} setReachedEnd={setReachedEnd} />
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  //let acc = await getUserAccount(session.user.id, prisma)
  //acc = JSON.parse(JSON.stringify(acc))

  let videos = await getVideos({}, prisma)
  videos = JSON.parse(JSON.stringify(videos))

  return {
    props: {
      initialVideos: videos,
      //acc,
    }
  }
}
