import { useRouter } from 'next/router'
import { useState } from 'react'


export default function SubscribedButton({ user, subscribed }) {
    const router = useRouter()

    const [subscribeButtonText, setSubscribeButtonText] = useState('Subscribed')
    const [subscribedButtonColor, setSubscribeButtonColor] = useState('green')

    return (
        <>
            {subscribed ? (
                <button className={`bg-${subscribedButtonColor}-500 px-3 py-2 rounded-md`}
                    onClick={async () => {
                        await fetch('/api/unsubscribe', {
                            body: JSON.stringify({
                                unsubscribeTo: user.id,
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'POST'
                        })

                        router.reload(window.location.pathname)
                    }}
                    onMouseOver={() => {
                        setSubscribeButtonText('Unsubscribe')
                        setSubscribeButtonColor('red')
                    }}
                    onMouseOut={() => {
                        setSubscribeButtonText('Subscribed')
                        setSubscribeButtonColor('green')
                    }}
                    >
                    {subscribeButtonText}
                </button>
            ) : (
                <button className='bg-red-500 px-3 py-2 rounded-md'
                    onClick={async () => {
                        await fetch('/api/subscribe', {
                            body: JSON.stringify({
                                subscribeTo: user.id,
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'POST'
                        })

                        router.reload(window.location.pathname)
                    }}>
                    Subscribe
                </button>
            )}
        </>
    )
}