import { useState } from 'react'
import '../styles/LSPD.css' 

const NavigationTypes = [
    {
        icon: "M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z", 
        label: 'Notas', 
    },  
    {
        icon: "M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z", 
        label: 'Búsqueda ciudadana', 
    }, 
    {
        icon: "M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z", 
        label: 'Búsqueda de vehículo', 
    }
]

const LSPD = () => {
    const [type, setType] = useState('Notas')
    const [navigation, setNavigation] = useState(false) 
    const [creator, showCreator] = useState(false)
    const [input, setInput] = useState('')
    const [area, setArea] = useState('')
    const [notes, setNotes] = useState([ 
        {
            label: 'Detención', 
            date: '08/04/22', 
            description: 'El otro dia no se porqué pasó esta vaina pero se dió lugar el robo',  
            titular: 'Jayden Clark'
        }, 
        {
            label: 'Detención', 
            date: '08/04/22', 
            description: 'El otro dia no se porqué pasó esta vaina pero se dió lugar el robo',  
            titular: 'Jayden Clark'
        }, 
        {
            label: 'Detención', 
            date: '08/04/22', 
            description: 'El otro dia no se porqué pasó esta vaina pero se dió lugar el robo l otro dia no se porqué pasó esta vaina pero se dió lugar el robo l otro dia no se porqué pasó esta vaina pero se dió lugar el robo l otro dia no se porqué pasó esta vaina pero se dió lugar el robo l otro dia no se porqué pasó esta vaina pero se dió lugar el robo',  
            titular: 'Jayden Clark'
        } 
    ])

    return (
        <>
            <div className='lspd'>
                {
                    creator ? <>
                        <div className='creator'>
                            <div className='center'>
                                <label>Crear nueva nota</label>
                                <input value={input} onChange={(e) => setInput(e.target.value)} type='text' placeholder="Título" maxLength={15} />
                                <textarea value={area} onChange={(e) => setArea(e.target.value)} maxLength={1000} placeholder="Por favor, escriba el contenido de la nota." spellCheck={false} style={{ resize: 'none'}}></textarea>
                                
                                <div className='actions'>   
                                    <button onClick={() => {
                                        $.post('https://fm_phone/createLSPDNote', JSON.stringify({
                                            
                                        }))
                                    }}>Crear</button>
                                    <button onClick={() => {
                                        showCreator(false)
                                        setInput('')
                                        setArea('') 
                                    }}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </> : <></>
                }    
                
                <div className='servicerName'>Jayden Clark</div>

                {
                    type == 'Notas' ? <svg className='newNote' onClick={() => showCreator(true) } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg> : <></>
                }
            
                {
                    navigation ? <>
                        <svg className='listToggle' onClick={() => setNavigation(false) } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
                        
                        <div className='navigationContainer'>
                            {
                                NavigationTypes.map((e:any) => {
                                    return (
                                        <div className='listsItem' onClick={() => setType(e.label)} style={{
                                            opacity: e.label == type ? 0.5 : 1
                                        }} key={ e.label }>
                                            <svg className='listIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d={ e.icon }/></svg>
                                            <label>{ e.label }</label> 
                                        </div> 
                                    )
                                })
                            }
                        </div>
                    </> :  <>
                        <svg className='listToggle' onClick={() => setNavigation(true) } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>
                        
                        <div className='typeContainer'>
                            {
                                type == 'Notas' ? <>
                                    {
                                        notes.length > 0 ? <>
                                            {
                                                notes.map((e, index) => {
                                                    return <div className='note' key={index}>
                                                        <label className='header'>{ e.label }: <a>{ e.date }</a></label>

                                                        <div className='description'>
                                                            { e.description }
                                                        </div> 

                                                        <div className='titular'>{ e.titular }</div>
                                                    </div>
                                                })
                                            }
                                        </> :  <>
                                            <a className='middle'>No hay notas existentes</a>
                                        </>
                                    }
                                </> : <>
                                    <a className='middle'>¡Vaya! Ha ocurrido un error</a>
                                </>
                            }
                        </div>
                    </> 
                }
            </div>
        </>
    )
}

export default LSPD 