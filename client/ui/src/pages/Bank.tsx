import { useEffect, useState } from 'react'
import '../styles/Bank.css' 

const Bank = () => {
    const [logged, setLogged] = useState(false)
    const [iban, setIban] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [bankData, setBankData] = useState({
        cardid: 'Error', 
        metadata: {
            money: 'Error', 
            history: [
                {
                    type: 'remove', 
                    quant: 200, 
                    date: '01/03/2022 (16:03:22)'
                }
            ]
        }
    })

    useEffect(() => {
        window.addEventListener('message', function(e){
            if(e.data.action === 'bank'){
                if(e.data.account){
                    setBankData(e.data.account)
                    setLogged(true)
                }
            }
        })
    }, [])

    return (
        <div className='bankContainer'>
            {
                !logged ? (
                    <div className='login'>
                        <div>Iniciar sesión, <span>Banco</span></div>

                        <input type='text' value={iban} onChange={(e) => setIban(e.target.value)} placeholder='IBAN' />
                        <input type='password' value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder='PIN' />
                    
                        <button onClick={() => {
                            setPinCode('')
                            setIban('')
                            $.post('https://fm_phone/requestBankTransactions', JSON.stringify({ iban: iban, pin: pinCode}))
                        }}>Acceder</button>
                    </div>
                ) : (
                    <>
                        <div className='card'>
                            <label className='iban'>IBAN: <span>{ bankData.cardid }</span></label> 
                            <label className='balance'>{ bankData.metadata.money }<span>$</span></label>
                        </div> 

                        <div className='transactions'>
                            {
                                bankData.metadata.history.length > 0 ? (
                                    bankData.metadata.history.map((e:any) => { 
                                        if(e.type == 'deposit'){
                                            return <div className='transaction' style={{
                                                'backgroundColor': '#FFF', 
                                                'boxShadow': 'inset 0px 0px 5px whitesmoke'
                                            }}>
                                                <div className='string'>+{ e.quant }</div>
                                                <div className='date'>{ e.date }</div>
                                            </div>
                                        } else if(e.type == 'remove'){
                                            return <div className='transaction' style={{
                                                'backgroundColor': '#EEF48B', 
                                                'boxShadow': 'inset 0px 0px 5px #BCC261'
                                            }}>
                                                <div className='string'>-{ e.quant }</div>
                                                <div className='date'>{ e.date }</div>
                                            </div>
                                        } 
                                    })
                                ) : <></>
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Bank 