import create from 'zustand' 
import { Config } from '../Config'

const useStore = create((set:any) => ({ 
    locked: true, 
    pincode: 'none', 
    brightness: 100, 
    currentApp: 'home', 
    currentPage: 0, 
    battery: 60, 
    wallpaperURL: Config['settings']['wallpapers'][0].url,  
    wifi: true, 
    mobiledata: true,
    notify: false, 
    volume: 60, 
    phoneNumber: 544921875,  
    profilePicture: 'none',   
    contacts: [
        {
            label: 'test', 
            number: 123455, 
            image: 'none'
        }
    ],
    chatList: [
        {
            id: 1, 
            data: { label: 'Hello world' }, 
            messages: [], 
            members: [{"number":"544921875","rank":"admin"},{"number":"234918257","rank":"user"}]
        }
    ],
    gallery: [
        {
            url: 'https://i.imgur.com/2kwzDhS.jpg', 
            date: 'Hola', 
            label: 'Que dice compadre'
        }
    ], 

    setCurrentApp: (app:any) => set((state:any) => ({ currentApp: app })), 
    setPage: (page:number) => set((state:any) => ({ currentPage: page })), 
    setLocked: (page:boolean) => set((state:any) => ({ locked: page })), 
    setPinCode: (page:string) => set((state:any) => ({ pincode: page })), 
    setPhoneNumber: (num:number) => set((state:any) => ({ phoneNumber: num })), 
    setWallpaper: (newWallpaper:any) => set((state:any) => ({ wallpaperURL: newWallpaper })), 
    setBrightness: (percent:any) => set((state:any) => ({ brightness: percent })), 
    setWifi: (bool:boolean) => set((state:any) => ({ wifi: bool })), 
    setMobiledata: (bool:boolean) => set((state:any) => ({ mobiledata: bool })), 
    allowNotifications: (bool:boolean) => set((state:any) => ({ notify: bool })), 
    changeVolume: (percent:number) => set((state:any) => ({ volume: percent })), 
    setBattery: (percent:number) => set((state:any) => ({ battery: percent })), 
    setProfilePicture: (img:string) => set((state:any) => ({ profilePicture: img })), 
    setContacts: (table:object) => set((state:any) => ({ contacts: table})), 
    setGallery: (table:object) => set((state:any) => ({ gallery: table})), 
    setChatList: (table:object) => set((state:any) => ({ chatList: table})),   
}))

export default useStore 