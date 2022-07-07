import { useState } from 'react' 
import '../styles/Input.css'  

const Input: React.FC<{update:any, close:any, current:any}> = ({update, close, current}) => {  
    const [imageURL, setImageURL] = useState(current)
    
    return (
        <div className='input-value'>
            <input type="text" value={ imageURL.length > 0 ? `${imageURL}` : '' } placeholder="URL de la Imagen" onChange={(e:any) => {  
                setImageURL(e.target.value)
            }} />

            <button onClick={(e:any) => {
                close(false)
                update(imageURL) 
            }}>Aceptar</button>
        </div>
    )
}


export default Input