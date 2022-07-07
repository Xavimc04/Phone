import useStore from "../utils/stores"

const Hotbar = () => {
    const store = useStore()

    return (
        <div className="hotbar-container">
            <div className="hotbar" onClick={() => {
                if(store.currentApp != 'home'){
                    store.setCurrentApp('home')
                } else {
                    $.post('https://fm_phone/close')
                }
            }}></div>
        </div>
    )
}

export default Hotbar 