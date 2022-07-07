import { useState } from 'react'
import '../styles/Mail.css' 

const Mail = () => {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [register, setRegistering] = useState(false)

    return (
        <div className='mailContainer'>
            <div className='square'>
                <div className='name'>FM:<span>Mail</span></div>
                <input type='text' placeholder={ register ? 'Ej: Pablo Escobar' : 'Correo electrónico'} value={mail} onChange={(e) => setMail(e.target.value)} />
                <input type='password' placeholder='Contraseña' value={password} onChange={(e) => setMail(e.target.value)} />
            
                {
                    register ? (
                        <>
                            <button>
                                Registrarse
                            </button>

                            <div className='change' onClick={() => setRegistering(!register)}>¿Tienes cuenta? Inicia sesión</div>
                        </>
                    ) : (
                        <>
                            <button>
                                Iniciar sesión
                            </button>

                            <div className='change' onClick={() => setRegistering(!register)}>¿No tienes cuenta? Registrate</div>
                        </>
                    )
                } 
            </div>
        </div>
    )
}

export default Mail 