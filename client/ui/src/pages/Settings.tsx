import { useState, useEffect } from 'react'
import '../styles/Settings.css'  
import Select from '../components/Select'
import Progressbar from '../components/Progressbar'
import { Config } from '../Config' 
import useStore from '../utils/stores'

const Settings = () => {
    const store = useStore()
    
    const [selectedItem, setSelectItem] = useState<any>('') 
    const [showWallPaper, setShowWallPaper] = useState(false)
    const [currentBrightness, setCurrentBrightness] = useState<any>(store.brightness) 
    const [showBrightness, setShowBrightness] = useState(false)
    const [currentVolume, setVolume] = useState<any>(store.volume) 
    const [showVolume, setShowVolume] = useState(false)

    const [showPinCode, setShowPincode] = useState(false)
    const [pinValue, setPinValue] = useState('')

    const [wifiEnabled, setWifiEnabled] = useState(store.wifi)
    const [notificationsEnabled, setNotificationsEnabled] = useState(store.notify)
    const [mobileDataEnabled, setMobileDataEnabled] = useState(store.mobiledata)

    useEffect(() => { 
        if(selectedItem.url !== undefined){ 
            store.setWallpaper(selectedItem.url)
            setShowWallPaper(false) 
        }
    }, [selectedItem])

    useEffect(() => { 
        store.setBrightness(currentBrightness)
        setShowBrightness(false) 
    }, [currentBrightness])

    useEffect(() => { 
        store.changeVolume(currentVolume)
        setShowVolume(false) 
    }, [currentVolume])

    useEffect(() => { 
        store.setWifi(wifiEnabled)
    }, [wifiEnabled])

    useEffect(() => { 
        store.setMobiledata(mobileDataEnabled)
    }, [mobileDataEnabled])

    useEffect(() => { 
        store.allowNotifications(notificationsEnabled)
    }, [notificationsEnabled])
    
    return (
        <div className="settings"> 
            <div className='settings-container'>
                <div className='information'> 
                    <div>Versión del Sistema: <span>1.0.1</span></div>
                    <div>Modelo: <span>FMPv1</span></div>
                </div>

                <hr />

                <table>
                    <thead>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <tr>
                            <th>Activar Wifi</th>
                            <th className='center'>
                                <label className="switch">
                                    <input type="checkbox" checked={ wifiEnabled } onChange={(e:any) => setWifiEnabled(e.target.checked) } />
                                    <span className="slider round"></span>
                                </label>
                            </th>
                        </tr>

                        <tr>
                            <th>Datos móviles</th>
                            <th className='center'>
                                <label className="switch">
                                    <input type="checkbox" checked={ mobileDataEnabled } onChange={(e:any) => setMobileDataEnabled(e.target.checked) } />
                                    <span className="slider round"></span>
                                </label>
                            </th>
                        </tr>

                        <tr>
                            <th>Mostrar notificaciones</th>
                            <th className='center'>
                                <label className="switch">
                                    <input type="checkbox" checked={ notificationsEnabled } onChange={(e:any) => setNotificationsEnabled(e.target.checked) }  />
                                    <span className="slider round"></span>
                                </label>
                            </th>
                        </tr> 

                        <tr>
                            <th onClick={() => setShowWallPaper(!showWallPaper) }>Fondo de Pantalla</th> 
                        </tr>

                        <tr>
                            <th onClick={() => setShowBrightness(!showBrightness) }>Brillo</th> 
                        </tr>

                        <tr>
                            <th onClick={() => setShowVolume(!showVolume) }>Volumen</th> 
                        </tr>

                        <tr>
                            <th onClick={() => setShowPincode(true) }>Contraseña</th> 
                        </tr>

                        {showWallPaper &&
                            <Select select = {setSelectItem} close={setShowWallPaper} selected = {selectedItem} items = {Config['settings']['wallpapers']}/> 
                        }

                        {showBrightness &&
                            <Progressbar update = {setCurrentBrightness} close={setShowBrightness} current = { currentBrightness } /> 
                        }

                        {showVolume &&
                            <Progressbar update = {setVolume} close={setShowVolume} current = { currentVolume } /> 
                        }

                        {
                            showPinCode ? (
                                <div className='pinCodeContainer'> 
                                    <input type='text' readOnly={true} value={pinValue} maxLength={6} />

                                    <div className='codeNumbers'>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '1')} }}><span>1</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '2')} }}><span>2</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '3')} }}><span>3</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '4')} }}><span>4</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '5')} }}><span>5</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '6')} }}><span>6</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '7')} }}><span>7</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '8')} }}><span>8</span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '9')} }}><span>9</span></div>
                                        <div onClick={() => setPinValue('')}><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M93.13 257.7C71.25 275.1 53 313.5 38.63 355.1L99 333.1c5.75-2.125 10.62 4.749 6.625 9.499L11 454.7C3.75 486.1 0 510.2 0 510.2s206.6 13.62 266.6-34.12c60-47.87 76.63-150.1 76.63-150.1L256.5 216.7C256.5 216.7 153.1 209.1 93.13 257.7zM633.2 12.34c-10.84-13.91-30.91-16.45-44.91-5.624l-225.7 175.6l-34.99-44.06C322.5 131.9 312.5 133.1 309 140.5L283.8 194.1l86.75 109.2l58.75-12.5c8-1.625 11.38-11.12 6.375-17.5l-33.19-41.79l225.2-175.2C641.6 46.38 644.1 26.27 633.2 12.34z"/></svg></span></div>
                                        <div onClick={() => { if(pinValue.length <= 6){setPinValue(pinValue + '0')} }}><span>0</span></div>
                                        <div onClick={() => { 
                                            if(pinValue.length > 0){ 
                                                store.setPinCode(pinValue)
                                                $.post('https://fm_phone/changepin', JSON.stringify({
                                                    phone: store.phoneNumber, 
                                                    pin: pinValue
                                                }))
                                                
                                                setPinValue('')
                                                setShowPincode(false)
                                            } else {
                                                store.setPinCode('none')
                                                $.post('https://fm_phone/changepin', JSON.stringify({
                                                    phone: store.phoneNumber, 
                                                    pin: 'none'
                                                }))
                                                
                                                setPinValue('')
                                                setShowPincode(false)
                                            }
                                        }}><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"/></svg></span></div>
                                    </div>

                                    <label className='swipe' onClick={() => {
                                        setPinValue('')
                                        setShowPincode(false)
                                    }}>Volver</label>
                                </div>
                            ) : <></>
                        }
                    </tbody>
                </table>  
            </div>
        </div>
    )
}

export default Settings 