import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Heading({ subscriptions }) {
    const router = useRouter()

    const { data: session, status } = useSession()

    const loading = status === 'loading'
  
    if (loading) {
      return null
    }

    return (
        <header className='h-14 flex pt-5 px-5 pb-2'>
            <div className='text-xl'>
                {router.asPath === '/' ? (
                    <p>Youtube Clone</p>
                ) : (
                    <Link href={`/`}>
                        <a className='underline'>Home</a>
                    </Link>
                )}
            </div>
            <div className='grow ml-10 -mt-1' />
            {session && 
            (router.asPath === '/subscriptions' ? (
                <a className='flex'>
                    <p className='mr-3 font-bold'>Subscriptions</p>
                </a>
            ): ( 
                <Link href={`/subscriptions`}>
                    <a className='flex'>
                        <p className='mr-3 underline'>Subscriptions</p>
                    </a>
                </Link>
            ))}
                {/* to retrieve additional session fields go to nextauth.js */}
                {/* this line uses the props to get the session username -> {session && ( <Link href={`/channel/${account.username}`}><a className=' cursor-pointer'>{session.user.name}</a></Link> )} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {session && ( <Link href={`/channel/${session.user.username}`}><a className=' cursor-pointer'>{session.user.name}</a></Link> )} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
                className='flex-l border px-4 font-bold'
                href={session ? '/api/auth/signout' : '/api/auth/signin'}
            >{session ? 'logout' : 'login'}</a>
        </header>
    )
}