import { useEffect, useState } from 'react'
import '../styles/Contacts.css'
import useStore from '../utils/stores'
import { Config } from '../Config'
import $ from 'jquery'

const Contacts = () => {
    const store = useStore()
    const [contacts, setContacts] = useState(store.contacts)
    const [showCreateNew, setShowCreateNew] = useState(false) 

    const [contactLabel, setContactLabel] = useState('')
    const [contactNumber, setContactNum] = useState('')

    useEffect(() => { 
        setContacts(store.contacts)
    }, [store.contacts])

    const submitHandler = (e:any) => {
        e.preventDefault(); 

        if(contactLabel.length > 0 && contactLabel.length <= 20 && contactNumber.length > 0 && contactNumber.length <= 20){
            $.post('https://fm_phone/createContact', JSON.stringify({
                phoneIndex: store.phoneNumber, 
                contactNumber: contactNumber, 
                contactLabel: contactLabel
            }))

            setContactLabel('')
            setContactNum('')
            setShowCreateNew(false) 
        }
    }

    return (
        <div className="contacts-container">
            <svg className="wave-messages" viewBox="0 0 1440 490" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"><stop stop-color="rgba(22.633, 22.441, 23.185, 0.95)" offset="0%"></stop><stop stop-color="rgba(89.212, 89.212, 89.212, 1)" offset="100%"></stop></linearGradient></defs><path fill="url(#sw-gradient-0)" d="M0,196L26.7,171.5C53.3,147,107,98,160,89.8C213.3,82,267,114,320,106.2C373.3,98,427,49,480,32.7C533.3,16,587,33,640,98C693.3,163,747,278,800,294C853.3,310,907,229,960,212.3C1013.3,196,1067,245,1120,277.7C1173.3,310,1227,327,1280,277.7C1333.3,229,1387,114,1440,65.3C1493.3,16,1547,33,1600,32.7C1653.3,33,1707,16,1760,24.5C1813.3,33,1867,65,1920,122.5C1973.3,180,2027,261,2080,285.8C2133.3,310,2187,278,2240,285.8C2293.3,294,2347,343,2400,326.7C2453.3,310,2507,229,2560,220.5C2613.3,212,2667,278,2720,318.5C2773.3,359,2827,376,2880,367.5C2933.3,359,2987,327,3040,334.8C3093.3,343,3147,392,3200,400.2C3253.3,408,3307,376,3360,367.5C3413.3,359,3467,376,3520,343C3573.3,310,3627,229,3680,187.8C3733.3,147,3787,147,3813,147L3840,147L3840,490L3813.3,490C3786.7,490,3733,490,3680,490C3626.7,490,3573,490,3520,490C3466.7,490,3413,490,3360,490C3306.7,490,3253,490,3200,490C3146.7,490,3093,490,3040,490C2986.7,490,2933,490,2880,490C2826.7,490,2773,490,2720,490C2666.7,490,2613,490,2560,490C2506.7,490,2453,490,2400,490C2346.7,490,2293,490,2240,490C2186.7,490,2133,490,2080,490C2026.7,490,1973,490,1920,490C1866.7,490,1813,490,1760,490C1706.7,490,1653,490,1600,490C1546.7,490,1493,490,1440,490C1386.7,490,1333,490,1280,490C1226.7,490,1173,490,1120,490C1066.7,490,1013,490,960,490C906.7,490,853,490,800,490C746.7,490,693,490,640,490C586.7,490,533,490,480,490C426.7,490,373,490,320,490C266.7,490,213,490,160,490C106.7,490,53,490,27,490L0,490Z"></path></svg>
            <svg onClick={() => setShowCreateNew(true) } className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/></svg>
        
            <div className='contacts-scroll'>
                {
                    contacts.map((e:any) => {
                        if(e){
                            return (
                                <div key={ e.number } className="registered-contact">
                                    <img
                                        src={ e.image }
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src= Config['messages']['default'].picture;
                                        }}
                                    />
    
                                    <div className='name'>{ e.label }</div>
                                    <div className='phone'>{ e.number }</div>
    
                                    <div className='actions'>
                                        <svg className='svg-action' onClick={() => $.post('https://fm_phone/reloadContact', JSON.stringify({
                                            phoneIndex: store.phoneNumber, 
                                            targetPhone: e.number 
                                        })) } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 14.31-32 32-32S496 30.31 496 48z"/></svg>
                                        <svg onClick={() => {
                                            $.post('https://fm_phone/contactToChat', JSON.stringify({
                                                targetPhone: e.number,
                                                image: e.image, 
                                                label: e.label 
                                            }))

                                            store.setCurrentApp('messages')
                                        }} className='svg-action' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.1 63.1v287.1c0 35.25-28.75 63.1-64 63.1h-144l-124.9 93.68c-7.875 5.75-19.12 .0497-19.12-9.7v-83.98h-96c-35.25 0-64-28.75-64-63.1V63.1c0-35.25 28.75-63.1 64-63.1h384C483.2 0 511.1 28.75 511.1 63.1z"/></svg>
                                        <svg onClick={() => {
                                            $.post('https://fm_phone/callContact', JSON.stringify({
                                                number: e.number 
                                            })) 
                                        }} className='svg-action' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"/></svg>
                                    </div> 
                                </div> 
                            )
                        }
                    })
                }
            </div>

            {
                showCreateNew ? (
                    <div className='create-new-container'>
                        <fieldset className='fieldset-name'>
                            <legend>Nombre</legend>

                            <input type='text' maxLength={20} value={ contactLabel } onChange={(e) => setContactLabel(e.target.value) } />  
                        </fieldset>

                        <fieldset className='fieldset-phone'>
                            <legend>Número de teléfono</legend>

                            <input type='number' value={ contactNumber } onChange={(e) => setContactNum(e.target.value) }  />  
                        </fieldset>

                        <button className='button' onClick={ submitHandler }>Añadir</button>
                        <button className='button' onClick={() => setShowCreateNew(false) }>Cancelar</button>
                    </div>
                ) : (
                    <></>
                )
            } 
        </div>
    )
}

export default Contacts 