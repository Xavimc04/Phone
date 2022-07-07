import '../styles/Notifications.css'
import useStore from '../utils/stores'

const Notification = (props:any) => {
    const store = useStore()

    return (
        <>
            {
                store.notify ? (
                    <div className='notification-container'>
                        <div className='not-title'><a>{ props.title }</a></div>
                        <div className='not-container'>
                            { props.content }
                        </div>
                    </div>
                ) : <></>
            }
        </>
    )
}

export default Notification 