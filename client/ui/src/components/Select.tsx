import '../styles/Select.css'  
import React from 'react'  

const Select: React.FC<{select:any, close:any, selected:any, items:any}> = ({select, close, selected, items}) => {

    return (
        <div className='select'>
            <div className='container-select'>
                { 
                    items.map((e:any) => {
                        return (
                            <div onClick={() => { 
                                close(false)
                                select(e) 
                            }} className='select-element'>{ e.label }</div>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default Select 