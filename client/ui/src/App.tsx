import { useState, useEffect } from 'react'
import useStore from './utils/stores'
import Header from './components/Header'
import Applications from './components/Applications'
import Hotbar from './components/Hotbar'
import Settings from './pages/Settings'
import './App.css'  
import Messages from './pages/Messages'
import Notification from './components/Notification'
import Contacts from './pages/Contacts'
import { useSwipeable } from 'react-swipeable'
import { Config } from './Config'
import Gallery from './pages/Gallery'
import AppStore from './pages/AppStore'
import Calculator from './pages/Calculator'
import Bank from './pages/Bank'
import Mail from './pages/Mail'
import LSPD from './pages/LSPD'

const App = () => {
    const store = useStore()
    const [showNotif, setShowNotif] = useState(false)
    const [phone, setShowPhone] = useState(false) // false
    const [locked, setPhoneLocked] = useState(store.locked) 
    const [hasPinCode, setHasPinCode] = useState(false)  
    const [showPinCode, setShowPinCode] = useState(false)  
    const [inputPinCode, setInputCode] = useState('') 
    const [notificationTitle, setNotificationTitle] = useState('')
    const [notificationContent, setNotificationContent] = useState('')
    const [wallpaper, setWallpaper] = useState(store.wallpaperURL)
    const [brightness, setBrightness] = useState(store.brightness) 
    const [calling, setCalling] = useState(false)   // false
    const [receiverCall, setReceiverCall] = useState(false)  
    const [inCall, setInCall] = useState(false)  // false
    const [callingNumber, setCallingNumber] = useState(0)
    const [isFounded, setHasBeenFounded] = useState(false)
    const [registeredContacts, setContacts] = useState(store.contacts)

    useEffect(() => {  
        setWallpaper(store.wallpaperURL)  
        $.post('https://fm_phone/updateWallpaper', JSON.stringify({ url: store.wallpaperURL }))
    }, [store.wallpaperURL])  

    const handlers = useSwipeable({   
        trackMouse: true, 
        
        onSwipedLeft: (eventData) => { 
            if(store.currentApp == 'home'){
                let obj = Object.getOwnPropertyNames(Config['applications']) 
    
                if(store.currentPage < (obj.length - 1)){ 
                    store.setPage(store.currentPage + 1)
                }
            }
        }, 

        onSwipedRight: (eventData) => { 
            if(store.currentApp == 'home'){
                if(store.currentPage > 0){ 
                    store.setPage(store.currentPage - 1)
                }
            }
        },

        onSwipedUp: (eventData) => {  
            if(locked){
                if(store.pincode != 'none'){
                    setInputCode('')
                    setShowPinCode(true)
                } else { 
                    store.setLocked(false)
                    setPhoneLocked(false)
                }
            }
        } 
    });

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

    useEffect(() => {  
        setBrightness(store.brightness)
        
        SendNotification({
            title: 'Configuración', 
            content: 'Se han aplicado los cambios de brillo'
        })
    }, [store.brightness])

    useEffect(() => {
        setContacts(store.contacts)
    }, [store.contacts])

    useEffect(() => {
        registeredContacts.map((f:any) => { 
            if(f.number == callingNumber){
                setHasBeenFounded(true) 
            }
        })
    }, [callingNumber])

    useEffect(() => {
        window.addEventListener('message', function(e){
            if(e.data.action === 'open'){
                setShowPhone(true) 
                let code = 'none'
                
                if(e.data.phone.data.pincode != null){ 
                    code = e.data.phone.data.pincode 
                    setHasPinCode(true)
                }
                
                if(e.data.first != null) {
                    if(e.data.first === true){
                        store.setLocked(true)
                        setPhoneLocked(store.locked)
                    }
                }

                store.setPinCode(code)
                store.setPhoneNumber(e.data.phone.number)
                store.setBrightness(e.data.phone.data.brightness)
                store.setBattery(e.data.phone.data.battery)
                store.setWallpaper(e.data.phone.data.wallpaperURL) 
                store.setWifi(e.data.phone.data.wifi)
                store.setMobiledata(e.data.phone.data.mobiledata)
                store.allowNotifications(e.data.phone.data.notify)
                store.setContacts(e.data.phone.contacts)
                store.setProfilePicture(e.data.phone.data.profilePicture)
                store.setGallery(e.data.phone.gallery) 

                if(e.data.phone.data.apps){ 
                    for(let i = 0; i < Config['applications'].length; i++){
                        for(let app = 0; app < Config['applications'][i].length; app++){ 
                            if(e.data.phone.data.apps[Config['applications'][i][app].app]){
                                Config['applications'][i][app].installed = true
                            } 
                        }
                    }

                    if(store.currentApp == 'store'){
                        store.setCurrentApp('home')
                        store.setCurrentApp('store')
                    }
                }

                if(e.data.phone.chats != null){
                    store.setChatList(e.data.phone.chats)
                }  
            } else if(e.data.action === 'close') {
                setShowPhone(false) // Primer error de todos... 

                for(let i = 0; i < Config['applications'].length; i++){
                    for(let app = 0; app < Config['applications'][i].length; app++){ 
                        if(e.data.phone.data.apps[Config['applications'][i][app].app]){
                            Config['applications'][i][app].installed = false 
                        } 
                    }
                }
            }

            if(e.data.action === 'createcall'){
                setCalling(true) 

                if(e.data.status == 'receiver'){ 
                    setReceiverCall(true)
                } 

                setCallingNumber(e.data.callingNumber)
            }

            if(e.data.action === 'cancelcall'){
                setCalling(false)
                setReceiverCall(false)
                setInCall(false) 
                setCallingNumber(0)
                setHasBeenFounded(false)
            }

            if(e.data.action === 'acceptcall'){
                setCalling(true)
                setReceiverCall(false)
                setInCall(true)  
            }
        })
    }, [])

    return (
        <>
            {
                phone ? (
                    <>
                        <div className="container" {...handlers} style={{
                            filter: `brightness(${brightness < 30 ? 30 : brightness }%)`, 
                            backgroundImage: `url(${wallpaper})` 
                        }}>
                            <Header battery={store.battery} /> 

                            {
                                locked ? (
                                    <div className='lockScreen'> 
                                        <svg className='lock' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>
                                        
                                        {
                                            hasPinCode && showPinCode ? (
                                                <>
                                                    <input type='password' readOnly={true} value={inputPinCode} maxLength={6} />

                                                    <div className='codeNumbers'>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '1')} }}><span>1</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '2')} }}><span>2</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '3')} }}><span>3</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '4')} }}><span>4</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '5')} }}><span>5</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '6')} }}><span>6</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '7')} }}><span>7</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '8')} }}><span>8</span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '9')} }}><span>9</span></div>
                                                        <div onClick={() => setInputCode('')}><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M93.13 257.7C71.25 275.1 53 313.5 38.63 355.1L99 333.1c5.75-2.125 10.62 4.749 6.625 9.499L11 454.7C3.75 486.1 0 510.2 0 510.2s206.6 13.62 266.6-34.12c60-47.87 76.63-150.1 76.63-150.1L256.5 216.7C256.5 216.7 153.1 209.1 93.13 257.7zM633.2 12.34c-10.84-13.91-30.91-16.45-44.91-5.624l-225.7 175.6l-34.99-44.06C322.5 131.9 312.5 133.1 309 140.5L283.8 194.1l86.75 109.2l58.75-12.5c8-1.625 11.38-11.12 6.375-17.5l-33.19-41.79l225.2-175.2C641.6 46.38 644.1 26.27 633.2 12.34z"/></svg></span></div>
                                                        <div onClick={() => { if(inputPinCode.length <= 6){setInputCode(inputPinCode + '0')} }}><span>0</span></div>
                                                        <div onClick={() => { if(inputPinCode.length > 0){ 
                                                            if(inputPinCode === store.pincode){
                                                                setInputCode('')
                                                                setShowPinCode(false)
                                                                store.setLocked(false)
                                                                setPhoneLocked(false)  
                                                            } else {
                                                                setInputCode('')
                                                            }
                                                        }}}><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"/></svg></span></div>
                                                    </div>

                                                    <label onClick={() => setShowPinCode(false) } className='swipe'>Volver</label>
                                                </>
                                            ) : ( 
                                                <label className='swipe'>Desliza para desbloquear</label>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <>
                                        { store.currentApp === 'home' ? (
                                            <Applications />
                                        ) : store.currentApp === 'settings' ? ( 
                                            <Settings />
                                        ) : store.currentApp === 'contacts' ? (
                                            <Contacts />
                                        ) : store.currentApp === 'gallery' ? (
                                            <Gallery />
                                        ) : store.currentApp === 'messages' ? (
                                            <Messages />
                                        ) : store.currentApp === 'store' ? (
                                            <AppStore />
                                        ) : store.currentApp === 'calculator' ? (
                                            <Calculator />
                                        ) : store.currentApp === 'bank' ? (
                                            <Bank />
                                        ) : store.currentApp === 'mail' ? (
                                            <Mail />
                                        ) : store.currentApp === 'lspd' ? (
                                            <LSPD />
                                        ) : ''}

                                        {
                                            showNotif ? (
                                                <Notification title = { notificationTitle } content = { notificationContent } />
                                            ) : <></>
                                        }

                                        {
                                            calling ? (
                                                <div className='calling-handler'>
                                                    {
                                                        registeredContacts.length > 0 ? (
                                                            registeredContacts.map((e:any, index) => {     
                                                                return <>
                                                                    <div className='caller-name'> 
                                                                        { e.number == callingNumber ? e.label : '' }
                                                                        { !isFounded && registeredContacts.length === index + 1 ? callingNumber : '' }
                                                                    </div> 
    
                                                                    {
                                                                        !isFounded ? (
                                                                            <img 
                                                                                src={ Config['messages']['default'].picture } 
                                                                            />  
                                                                        ) : (
                                                                            <img 
                                                                                src={ e.image != 'none' ? e.image : Config['messages']['default'].picture }
                                                                                onError={({ currentTarget }) => {
                                                                                    currentTarget.onerror = null;
                                                                                    currentTarget.src= Config['messages']['default'].picture;
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
    
                                                                    <div className='icons'>
                                                                        {
                                                                            receiverCall && !inCall ? (
                                                                                <svg style={{ fill: '#4ef958' }} onClick={() => {
                                                                                    $.post('https://fm_phone/acceptCall', JSON.stringify({
                                                                                        receiver: store.phoneNumber, 
                                                                                        caller: callingNumber
                                                                                    }))
                                                                                }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"/></svg>
                                                                            ) : <></>
                                                                        }    
                                                                            
                                                                        <svg style={{ fill: '#f95d4e' }} onClick={() => {
                                                                            $.post('https://fm_phone/hangCall', JSON.stringify({
                                                                                first: store.phoneNumber, 
                                                                                second: callingNumber 
                                                                            }))
                                                                        }}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M271.1 367.5L227.9 313.7c-8.688-10.78-23.69-14.51-36.47-8.974l-108.5 46.51c-13.91 6-21.49 21.19-18.11 35.79l23.25 100.8C91.32 502 103.8 512 118.5 512c107.4 0 206.1-37.46 284.2-99.65l-88.75-69.56C300.6 351.9 286.6 360.3 271.1 367.5zM630.8 469.1l-159.6-125.1c65.03-78.97 104.7-179.5 104.7-289.5c0-14.66-9.969-27.2-24.22-30.45L451 .8125c-14.69-3.406-29.73 4.213-35.82 18.12l-46.52 108.5c-5.438 12.78-1.771 27.67 8.979 36.45l53.82 44.08C419.2 232.1 403.9 256.2 386.2 277.4L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.84 3.158 5.121 9.189c-8.188 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z"/></svg>
                                                                    </div> 
    
                                                                    <svg className="wave" viewBox="0 0 1440 490" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(132.471, 132.471, 132.471, 1)" offset="0%"></stop><stop stop-color="rgba(70.998, 70.912, 70.724, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-0)" d="M0,0L180,0L360,0L540,147L720,343L900,294L1080,294L1260,49L1440,392L1620,343L1800,294L1980,392L2160,147L2340,392L2520,245L2700,392L2880,196L3060,441L3240,392L3420,49L3600,49L3780,0L3960,0L4140,196L4320,147L4320,490L4140,490L3960,490L3780,490L3600,490L3420,490L3240,490L3060,490L2880,490L2700,490L2520,490L2340,490L2160,490L1980,490L1800,490L1620,490L1440,490L1260,490L1080,490L900,490L720,490L540,490L360,490L180,490L0,490Z"></path><defs><linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(178.007, 175.965, 175.31, 1)" offset="0%"></stop><stop stop-color="rgba(52.784, 48.543, 39.168, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-1)" d="M0,294L180,392L360,294L540,0L720,147L900,245L1080,196L1260,441L1440,196L1620,147L1800,392L1980,147L2160,196L2340,343L2520,98L2700,0L2880,98L3060,98L3240,147L3420,343L3600,245L3780,343L3960,49L4140,441L4320,147L4320,490L4140,490L3960,490L3780,490L3600,490L3420,490L3240,490L3060,490L2880,490L2700,490L2520,490L2340,490L2160,490L1980,490L1800,490L1620,490L1440,490L1260,490L1080,490L900,490L720,490L540,490L360,490L180,490L0,490Z"></path><defs><linearGradient id="sw-gradient-2" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(57.337, 57.337, 57.337, 1)" offset="0%"></stop><stop stop-color="rgba(77.828, 76.776, 74.452, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-2)" d="M0,294L180,441L360,147L540,245L720,147L900,196L1080,0L1260,98L1440,98L1620,245L1800,0L1980,98L2160,98L2340,196L2520,245L2700,147L2880,343L3060,147L3240,147L3420,49L3600,147L3780,0L3960,49L4140,49L4320,245L4320,490L4140,490L3960,490L3780,490L3600,490L3420,490L3240,490L3060,490L2880,490L2700,490L2520,490L2340,490L2160,490L1980,490L1800,490L1620,490L1440,490L1260,490L1080,490L900,490L720,490L540,490L360,490L180,490L0,490Z"></path></svg>
                                                                </> 
                                                            })
                                                        ) : (
                                                            <>
                                                                <div className='caller-name'> 
                                                                    { callingNumber }
                                                                </div> 
    
                                                                <img 
                                                                    src={ Config['messages']['default'].picture } 
                                                                /> 
    
                                                                <div className='icons'>
                                                                    {
                                                                        receiverCall && !inCall ? (
                                                                            <svg style={{ fill: '#4ef958' }} onClick={() => {
                                                                                $.post('https://fm_phone/acceptCall', JSON.stringify({
                                                                                    receiver: store.phoneNumber, 
                                                                                    caller: callingNumber
                                                                                }))
                                                                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"/></svg>
                                                                        ) : <></>
                                                                    }    
                                                                        
                                                                    <svg style={{ fill: '#f95d4e' }} onClick={() => {
                                                                        $.post('https://fm_phone/hangCall', JSON.stringify({
                                                                            first: store.phoneNumber, 
                                                                            second: callingNumber 
                                                                        }))
                                                                    }}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M271.1 367.5L227.9 313.7c-8.688-10.78-23.69-14.51-36.47-8.974l-108.5 46.51c-13.91 6-21.49 21.19-18.11 35.79l23.25 100.8C91.32 502 103.8 512 118.5 512c107.4 0 206.1-37.46 284.2-99.65l-88.75-69.56C300.6 351.9 286.6 360.3 271.1 367.5zM630.8 469.1l-159.6-125.1c65.03-78.97 104.7-179.5 104.7-289.5c0-14.66-9.969-27.2-24.22-30.45L451 .8125c-14.69-3.406-29.73 4.213-35.82 18.12l-46.52 108.5c-5.438 12.78-1.771 27.67 8.979 36.45l53.82 44.08C419.2 232.1 403.9 256.2 386.2 277.4L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.84 3.158 5.121 9.189c-8.188 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z"/></svg>
                                                                </div> 
    
                                                                <svg className="wave" viewBox="0 0 1440 490" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(132.471, 132.471, 132.471, 1)" offset="0%"></stop><stop stop-color="rgba(70.998, 70.912, 70.724, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-0)" d="M0,0L180,0L360,0L540,147L720,343L900,294L1080,294L1260,49L1440,392L1620,343L1800,294L1980,392L2160,147L2340,392L2520,245L2700,392L2880,196L3060,441L3240,392L3420,49L3600,49L3780,0L3960,0L4140,196L4320,147L4320,490L4140,490L3960,490L3780,490L3600,490L3420,490L3240,490L3060,490L2880,490L2700,490L2520,490L2340,490L2160,490L1980,490L1800,490L1620,490L1440,490L1260,490L1080,490L900,490L720,490L540,490L360,490L180,490L0,490Z"></path><defs><linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(178.007, 175.965, 175.31, 1)" offset="0%"></stop><stop stop-color="rgba(52.784, 48.543, 39.168, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-1)" d="M0,294L180,392L360,294L540,0L720,147L900,245L1080,196L1260,441L1440,196L1620,147L1800,392L1980,147L2160,196L2340,343L2520,98L2700,0L2880,98L3060,98L3240,147L3420,343L3600,245L3780,343L3960,49L4140,441L4320,147L4320,490L4140,490L3960,490L3780,490L3600,490L3420,490L3240,490L3060,490L2880,490L2700,490L2520,490L2340,490L2160,490L1980,490L1800,490L1620,490L1440,490L1260,490L1080,490L900,490L720,490L540,490L360,490L180,490L0,490Z"></path><defs><linearGradient id="sw-gradient-2" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(57.337, 57.337, 57.337, 1)" offset="0%"></stop><stop stop-color="rgba(77.828, 76.776, 74.452, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-2)" d="M0,294L180,441L360,147L540,245L720,147L900,196L1080,0L1260,98L1440,98L1620,245L1800,0L1980,98L2160,98L2340,196L2520,245L2700,147L2880,343L3060,147L3240,147L3420,49L3600,147L3780,0L3960,49L4140,49L4320,245L4320,490L4140,490L3960,490L3780,490L3600,490L3420,490L3240,490L3060,490L2880,490L2700,490L2520,490L2340,490L2160,490L1980,490L1800,490L1620,490L1440,490L1260,490L1080,490L900,490L720,490L540,490L360,490L180,490L0,490Z"></path></svg>
                                                            </> 
                                                        )
                                                    }  
                                                </div>
                                            ) : <></>
                                        } 

                                        <Hotbar />
                                    </>
                                )
                            }

                        </div>

                        <div className='chase'></div>
                    </>
                ) : !phone && inCall ? (
                    <>
                        <div className="container-inCall" {...handlers} style={{
                            filter: `brightness(${brightness}%)`, 
                            backgroundImage: `url(${wallpaper})` 
                        }}>
                            <div className='callContainer'>
                                {
                                    registeredContacts.length > 0 ? (
                                        registeredContacts.map((e:any, index) => {     
                                            return <>
                                                <label>En llamada...</label>
    
                                                <div> 
                                                    { e.number == callingNumber ? e.label : '' }
                                                    { !isFounded && registeredContacts.length === index + 1 ? callingNumber : '' }
                                                </div> 
    
                                                {
                                                    !isFounded ? (
                                                        <img 
                                                            src={ Config['messages']['default'].picture } 
                                                        />  
                                                    ) : (
                                                        <img 
                                                            src={ e.image != 'none' ? e.image : Config['messages']['default'].picture }
                                                            onError={({ currentTarget }) => {
                                                                currentTarget.onerror = null;
                                                                currentTarget.src= Config['messages']['default'].picture;
                                                            }}
                                                        />
                                                    )
                                                } 
                                            </> 
                                        })
                                    ) : (
                                        <>
                                            <label>En llamada...</label>

                                            <div> 
                                                { callingNumber }
                                            </div> 

                                            <img 
                                                src={ Config['messages']['default'].picture } 
                                            />
                                        </>
                                    )
                                }  
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )
            }
        </>
    )
}

export default App 