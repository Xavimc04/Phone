import '../styles/AppStore.css' 
import { Config } from '../Config' 
import { useState } from 'react'
import Notification from '../components/Notification'

const AppStore = () => {  
    const [showNotif, setShowNotif] = useState(false)
    const [notificationTitle, setNotificationTitle] = useState('')
    const [notificationContent, setNotificationContent] = useState('')

    function SendNotification(props:any){
        setShowNotif(true)
        setNotificationContent(props.content)
        setNotificationTitle(props.title)
        
        setTimeout(() => {
            setShowNotif(false)
            setNotificationContent('')
            setNotificationTitle('')
        }, 10000)
    }

    return (
        <div className="store"> 
            <div className='header'>
                <label>Aplicaciones</label>
                <span>FMStore</span>
            </div>

            <div className='apps'>
                {
                    Config['applications'].map((e) => {
                        return e.map((app) => { 
                            return <div> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d={app.icon}/></svg>  
                            
                                <label>{app.label}</label>

                                {
                                    app.installed ? (
                                        <svg className='iconRight' style={{'fill': 'rgb(171, 255, 54)'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>
                                    ) : (
                                        <svg className='iconRight' onClick={() => {
                                            SendNotification({ title: 'AppStore', content: 'La aplicación seleccionada ha sido instalada correctamente, podrás encontrarla en la pantalla principal de tu teléfono'})
                                            $.post('https://fm_phone/installApp', JSON.stringify({ app: app.app }))
                                        }} style={{'fill': 'rgb(255, 79, 79)'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z"/></svg>
                                    )
                                }
                            </div>
                        })
                    })
                }

                {
                    showNotif ? ( 
                        <Notification title = { notificationTitle } content = { notificationContent } />
                    ) : <></>
                }
            </div>
        </div>
    )
}

export default AppStore