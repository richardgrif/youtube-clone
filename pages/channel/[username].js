import prisma from 'lib/prisma'
import Heading from 'components/Heading'
import Videos from 'components/Videos'
import LoadMore from 'components/LoadMore'
import SubscribedButton from 'components/SubscribedButton'
import Link from 'next/link'
import { getUser, getVideos, getSubscribersCount, isSubscribed } from 'lib/data'
import { useState } from 'react'
import { amount } from 'lib/config'   
import { getSession, useSession } from 'next-auth/react'

export default function Channel({ user, initialVideos, subscribers, subscribed }) {
    const [videos, setVideos] = useState(initialVideos)
    const [reachEnd, setReachedEnd] = useState(initialVideos.length < amount)
    const { data: session, status } = useSession()

    const loading = status === 'loading'
    if (loading) {
        return null
    }
    
    if (!user) return <p className='text-center p-5'>Channel does not exist 😞</p>

    return (
        <>
            {/* <Head>
                <title>Channel of {user.name}</title>
                <meta name='description' content={`Channel of ${user.name}`} />
                <link rel='icon' href='/favicon.ico' />
            </Head> */}
            <Heading  />
            <div>
                <div className='flex justify-between'>
                    <div className='flex m-5'>
                        {user.image && (
                            <img 
                                className='w-20 h-20 mt-2 mr-2 rounded-full'
                                src={user.image}
                            />
                        )}
                        <div className='mt-5'>
                            <p className='text-lg font-bold text-white'>{user.name}</p>
                            <div className=''>
                                <div className=''>
                                    <div className='text-gray-400'>
                                        {subscribers} subscribers
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-12 mr-5'>
                        {session && user.id === session.user.id ? (
                            <>
                                <Link href={`/upload`}>
                                    <a className='bg-green-500 px-3 py-2 rounded-md'>
                                        Upload New Video
                                    </a>
                                </Link>
                            </>
                        ) : ( 
                            <SubscribedButton user={user} subscribed={subscribed} />
                        )}
                    </div>
                </div>
                <div>
                    <Videos videos={videos} />
                    {!reachEnd && (
                        <LoadMore videos={videos} setVideos={setVideos}
                            setReachEnd={setReachedEnd} author={user}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    let user = await getUser(context.params.username, prisma)
    user = JSON.parse(JSON.stringify(user))

    let videos = await getVideos({ author: user.id }, prisma)
    videos = JSON.parse(JSON.stringify(videos))

    const subscribers = await getSubscribersCount(context.params.username, prisma)

    let subscribed = null
    if (session) {
        subscribed = await isSubscribed(session.user.username, user.id, prisma)
    }

    return {
        props: {
            user,
            initialVideos: videos,
            subscribers,
            subscribed,
        }
    }
}