import { useState } from 'react'
import '../styles/Progressbar.css'   

const Progressbar: React.FC<{update:any, close:any, current:any}> = ({update, close, current}) => {  
    const [newBrightness, setNewBrightness] = useState(current)
    
    return (
        <div className='progress'>
            <input type="range" value={ newBrightness } max="100" min="1" onChange={(e:any) => {  
                setNewBrightness(e.target.value)
            }} />

            <button onClick={(e:any) => {
                close(false)
                update(newBrightness)
            }}>X</button>
        </div>
    )
}


export default Progressbar