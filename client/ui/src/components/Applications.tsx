import { useEffect, useState } from "react"
import { Config } from "../Config" 
import useStore from "../utils/stores"

const Applications = () => { 
    const store = useStore() 
    const [apps, setApps] = useState(Config['applications'][0])

    useEffect(() => { 
        if(store.currentPage === 0){
            setApps(Config['applications'][0])
        } else {
            setApps(Config['applications'][1])
        } 
    }, [store.currentPage]) 

    return (
        <div className={
            (!store.currentPage ? 'app-container': 'secondary-app-container')
        }>
            {
                apps.map((e:any) => {
                    if(e.installed){
                        return (
                            <div className="app-square" key={ e.label }>
                                <div className="app-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{
                                        backgroundColor: '#' + e.color, 
                                        boxShadow: `0px 0px 10px #${e.color}`, 
                                    }} onClick={() => {
                                        store.setCurrentApp(e.app)
                                    }} viewBox="0 0 512 512"><path d={e.icon}/></svg> 
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default Applications 