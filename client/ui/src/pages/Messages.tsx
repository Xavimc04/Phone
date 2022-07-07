import '../styles/Messages.css'
import { Config } from '../Config'
import useStore from '../utils/stores'
import { useEffect, useState } from 'react'
import Input from '../components/Input'
import Notification from '../components/Notification' 
import parse from 'html-react-parser'   

const Messages = () => {
    const store = useStore() 
    const [chatState, setChatState] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const [notificationTitle, setNotificationTitle] = useState('')
    const [notificationContent, setNotificationContent] = useState('')
    const [filter, setFilter] = useState('')
    const [profilePicture, setProfilePicture] = useState(store.profilePicture)
    const [showConfig, setShowConfig] = useState(false)
    const [message, setMessage] = useState('')
    const [chatList, setChatList] = useState(store.chatList)

    const [messageList, setMessageList] = useState([])
    const [selectedLabel, setSelectedLabel] = useState('')
    const [selectedId, setSelectedId] = useState(0)
    const [selectedImage, setSelectedProfileImage] = useState('')

    const [showJoinGroup, setShowJoinGroup] = useState(false)
    const [grpManagement, setShowGrpManagement] = useState(false)

    const [profileImage, setGroupProfileImage] = useState('')
    const [groupName, setGroupName] = useState('')
    const [groupInviteCode, setGroupInviteCode] = useState(0) 

    const [groupMembers, setGroupMembers] = useState([])

    const [isAdminOnGroup, setIsAdmin] = useState(false)

    const [newPopUp, changePopUpState] = useState(false)
    const [popUpInput, setPopupInput] = useState('')

    const [showImageHandler, setShowImageHandler] = useState(false)
    const [images, setImages] = useState(store.gallery)

    useEffect(() => {
        setImages(store.gallery) 
    }, [store.gallery]) 

    useEffect(() => {
        setGroupName(selectedLabel)
        setGroupInviteCode(selectedId)
        setGroupProfileImage(selectedImage) 
    }, [selectedLabel])

    useEffect(() => {
        setChatList(store.chatList) 
        
        if(chatState){
            if(store.chatList.length > 0){
                for(let i = 0; i < store.chatList.length; i++){
                    if(store.chatList[i].id === selectedId){
                        setMessageList(store.chatList[i].messages) 
                    }
                }
            }
        }
    }, [store.chatList]) 

    function SendNotification(props:any){
        setShowNotif(true)
        setNotificationContent(props.content)
        setNotificationTitle(props.title)
        
        setTimeout(() => {
            setShowNotif(false)
            setNotificationContent('')
            setNotificationTitle('')
        }, 10000)
    }

    useEffect(() => {   
        setShowConfig(false)
        setProfilePicture(store.profilePicture)

        $.post('https://fm_phone/setProfilePicture', JSON.stringify({
            phoneIndex: store.phoneNumber, 
            picture: store.profilePicture
        })) 
    }, [store.profilePicture])

    const openChatHandler = (e:any) => {  
        setMessageList(e.messages)  
        setSelectedLabel(e.data.label)
        setSelectedId(e.id)
        setSelectedProfileImage(e.data.profilePicture)
        setGroupMembers(e.members)
        setChatState(true) 

        for(let i = 0; i < e.members.length; i++){
            if(e.members[i].rank == 'admin'){
                if(e.members[i].number == store.phoneNumber){
                    setIsAdmin(true) 
                }
            }
        }
    }

    const messageSendHandler = (e:any) => {
        e.preventDefault()

        if(message.length > 0){
            $.post('https://fm_phone/messageSend', JSON.stringify({
                grpId: selectedId, 
                message: message 
            }))

            setMessage('')
        } else {
            SendNotification({
                title: 'Error', 
                content: 'Por favor, introduce un mensaje válido'
            })
        }
    }  

    const handleAdminGroup = (e:any) => {
        e.preventDefault()

        setShowGrpManagement(true)
        setShowJoinGroup(false)
    }

    const saveGroupChanges = (e:any) => {
        e.preventDefault()

        if(groupName.length > 0 && groupName.length <= 30 && groupInviteCode > 0) {
            $.post('https://fm_phone/updateGroup', JSON.stringify({
                groupId: selectedId, 
                groupName: groupName, 
                profilePicture: profileImage, 
                inviteCode: groupInviteCode
            }))
            
            setShowJoinGroup(false)
        }
    }

    return (
        <div className='messages-app'>
            {
                !chatState ? (
                    <div className='chat-main'>
                        <div className='header'>
                            <img 
                                src={ profilePicture }
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src= Config['messages']['default'].picture;
                                }} 

                                onClick={() => setShowConfig(!showConfig)}
                            /> 

                            <input 
                                placeholder='Buscar...' 
                                value={filter}
                                onChange={event => setFilter(event.target.value)}
                            />

                            <svg onClick={() => {
                                changePopUpState(true)
                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"/></svg>
                        </div>
                        
                        <div className='messages-scroll'>  
                            {
                                chatList.filter((f:any) => f.data.label.toLowerCase().includes(filter.toLowerCase()) || filter === '')
                                .map((f:any) => <div key={f.id}
                                        onClick={() => openChatHandler(f) }
                                        className='chat-user-container'
                                    >
                                    <img 
                                        src={ f.data.profilePicture }
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src= Config['messages']['default'].picture;
                                        }}
                                    />

                                    <span className='label'>{f.data.label}</span>
                                    <span className='phone'>{ f.members.length } Miembros</span>
                                </div>)
                            }
                        </div>

                        {
                            showConfig ? (
                                <Input update = { store.setProfilePicture } close={ setShowConfig } current = { profilePicture } /> 
                            ) : <></>
                        }
                    </div>
                ) : chatState === true && !showConfig ? (
                    <div className='chat-main chatting'>  
                        
                        <div className='message-header'>
                            <svg onClick={() => setChatState(false)} className='hd-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M384 352v64c0 17.67-14.33 32-32 32H96c-17.67 0-32-14.33-32-32v-64c0-17.67-14.33-32-32-32s-32 14.33-32 32v64c0 53.02 42.98 96 96 96h256c53.02 0 96-42.98 96-96v-64c0-17.67-14.33-32-32-32S384 334.3 384 352zM201.4 9.375l-128 128c-12.51 12.51-12.49 32.76 0 45.25c12.5 12.5 32.75 12.5 45.25 0L192 109.3V320c0 17.69 14.31 32 32 32s32-14.31 32-32V109.3l73.38 73.38c12.5 12.5 32.75 12.5 45.25 0s12.5-32.75 0-45.25l-128-128C234.1-3.125 213.9-3.125 201.4 9.375z"/></svg>
                            <a className='selected' onClick={() => setShowJoinGroup(true)}>{ selectedLabel }</a>
                        </div> 

                        <div className='message-list'>
                            {
                                messageList.map((f:any) => {
                                    if(f){
                                        if(f.extra != null){
                                            if(f.extra.type === 'location'){
                                                if(f.sender == store.phoneNumber){
                                                    return <div key={ f.id } className='right-message'> 
                                                        <div className='hour'>
                                                            { f.date }
                                                        </div>

                                                        <div className='message' onClick={() => {
                                                            $.post('https://fm_phone/extraMessage', JSON.stringify({
                                                                extra: f.extra 
                                                            }))
                                                        }}>{ parse(f.content) }</div>
                                                    </div> 
                                                } else {
                                                    return <div key={ f.id } className='left-message'> 
                                                        <div className='hour'>
                                                            { f.date }
                                                        </div>

                                                        <div className='message' onClick={() => {
                                                            $.post('https://fm_phone/extraMessage', JSON.stringify({
                                                                extra: f.extra 
                                                            }))
                                                        }}>{ parse(f.content) }</div>
                                                    </div> 
                                                }
                                            }
                                        } else {
                                            if(f.sender == store.phoneNumber){
                                                return <div key={ f.id } className='right-message'>
                                                    <div className='hour'>
                                                        { f.date }
                                                    </div>

                                                    <div className='message'>{ parse(f.content) }</div>
                                                </div> 
                                            } else {
                                                return <div key={ f.id } className='left-message'>
                                                    <div className='hour'>{ f.date } 
                                                        {
                                                            store.contacts.map((contact:any) => {
                                                                if(contact.number == f.sender){
                                                                    return <label key={ f.sender }> - { contact.label }</label>
                                                                } else {
                                                                    return <label key={ f.sender }> - { f.sender }</label>
                                                                }
                                                            })
                                                        } 
                                                    </div>
    
                                                    <div className='message'>{ parse(f.content) }</div>
                                                </div> 
                                            }
                                        }
                                    }
                                })
                            }
                        </div> 

                        <input type='text' placeholder='Mensaje...' value={ message } onChange={(e) => setMessage(e.target.value)}  />

                        <div className='msvgcontainer'>
                            <svg className='m-svg' onClick={() => {
                                setShowImageHandler(true)
                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M447.1 32h-384C28.64 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM111.1 96c26.51 0 48 21.49 48 48S138.5 192 111.1 192s-48-21.49-48-48S85.48 96 111.1 96zM446.1 407.6C443.3 412.8 437.9 416 432 416H82.01c-6.021 0-11.53-3.379-14.26-8.75c-2.73-5.367-2.215-11.81 1.334-16.68l70-96C142.1 290.4 146.9 288 152 288s9.916 2.441 12.93 6.574l32.46 44.51l93.3-139.1C293.7 194.7 298.7 192 304 192s10.35 2.672 13.31 7.125l128 192C448.6 396 448.9 402.3 446.1 407.6z"/></svg>
                            <svg onClick={ messageSendHandler } className='m-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"/></svg>
                            <svg className='m-svg' onClick={() => {
                                $.post('https://fm_phone/sendLocation', JSON.stringify({
                                    grpId: selectedId
                                }))
                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M273.2 311.1C241.1 271.9 167.1 174.6 167.1 120C167.1 53.73 221.7 0 287.1 0C354.3 0 408 53.73 408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1V311.1zM416 503V200.4C419.5 193.5 422.7 186.7 425.6 179.8C426.1 178.6 426.6 177.4 427.1 176.1L543.1 129.7C558.9 123.4 576 135 576 152V422.8C576 432.6 570 441.4 560.9 445.1L416 503zM15.09 187.3L137.6 138.3C140 152.5 144.9 166.6 150.4 179.8C153.3 186.7 156.5 193.5 160 200.4V451.8L32.91 502.7C17.15 508.1 0 497.4 0 480.4V209.6C0 199.8 5.975 190.1 15.09 187.3H15.09zM384 504.3L191.1 449.4V255C212.5 286.3 234.3 314.6 248.2 331.1C268.7 357.6 307.3 357.6 327.8 331.1C341.7 314.6 363.5 286.3 384 255L384 504.3z"/></svg>
                        </div>
                    </div>
                ) : <></>
            }

            {
                showNotif ? (
                    <Notification title = { notificationTitle } content = { notificationContent } />
                ) : <></>
            }

            {
                showImageHandler ? (
                    <div className='select'>
                        <div className='container-select'>
                            { 
                                images.map((e:any) => { 
                                    if(e != null){
                                        return (
                                            <div onClick={() => { 
                                                $.post('https://fm_phone/sendImageToGroup', JSON.stringify({
                                                    grpId: selectedId,  
                                                    image: `<img className='mesage-with-image' src='${e.url}'/>`
                                                }))
    
                                                setShowImageHandler(false)
                                            }} className='select-element'>{ e.label }</div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                ) : <></>
            }

            {
                showJoinGroup ? (
                    <div className='first-config'>
                        <fieldset className='fieldset-invite-code'>
                            <legend>Código de invitación</legend>

                            <input type='number' value={ groupInviteCode } onChange={(e) => setGroupInviteCode(parseInt(e.target.value))}  placeholder='Código numérico' />  
                        </fieldset>

                        <fieldset className='fieldset-image'>
                            <legend>Imagen de perfil</legend>

                            <input type='text' value={ profileImage } onChange={(e) => setGroupProfileImage(e.target.value)}  placeholder='Introduce la URL' />  
                        </fieldset>

                        <fieldset className='fieldset-name'>
                            <legend>Nombre</legend>

                            <input type='text' value={ groupName } onChange={(e) => setGroupName(e.target.value)}  placeholder='Ej: Los Panas'  />  
                        </fieldset>

                        <button className='button' onClick={ saveGroupChanges }>Guardar</button>
                        <button className='button' onClick={() => setShowJoinGroup(false)}>Cancelar</button>

                        {
                            isAdminOnGroup ? (
                                <button className='button' onClick={ handleAdminGroup }>Administrar</button> 
                            ) : (
                                <></>
                            )
                        }
                    </div> 
                ) : (
                    <></>
                )
            }

            {
                grpManagement ? (
                    <div className='group-management'>
                        <div className='members-scroll'>
                            {
                                groupMembers.map((e:any) => {
                                    return <div className='member'>
                                        {
                                            store.contacts.length > 0 ? (
                                                <>
                                                    {
                                                        store.contacts.map((contact:any) => {
                                                            if(contact.number == e.number){
                                                                return <label key={ e.number }>{ contact.label }</label>
                                                            } else if(e.number == store.phoneNumber){
                                                                return <label key={ e.number }>Tu mismo</label>
                                                            } else {
                                                                return <label key={ e.number }>{ e.number }</label>
                                                            }
                                                        })
                                                    }
                                                </>
                                            ) : <label key={ e.number }>Tu mismo</label>
                                        } 

                                        {
                                            store.phoneNumber != e.number ? (
                                                <svg className='iconm' onClick={() => {
                                                    $.post('https://fm_phone/kickFromGroup', JSON.stringify({
                                                        grpId: selectedId, 
                                                        target: e.number, 
                                                        members: groupMembers
                                                    }))

                                                    setShowGrpManagement(false)
                                                    setChatState(false)
                                                }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM99.5 144.8C77.15 176.1 64 214.5 64 256C64 362 149.1 448 256 448C297.5 448 335.9 434.9 367.2 412.5L99.5 144.8zM448 256C448 149.1 362 64 256 64C214.5 64 176.1 77.15 144.8 99.5L412.5 367.2C434.9 335.9 448 297.5 448 256V256z"/></svg>
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </div> 
                                })
                            }
                        </div> 

                        <button className='close-management' onClick={() => {
                            setShowGrpManagement(false)
                            setShowJoinGroup(true)
                        }}>Volver</button>
                    </div> 
                ) : (
                    <></>
                )
            }

            {
                newPopUp ? (
                    <div className='new'>
                        <div className='popUp'>
                            <input type='text' onChange={(e) => { 
                                setPopupInput(e.target.value)
                            }} placeholder='Código de invitación' />
                            <button onClick={() => {
                                if(popUpInput.length > 0){
                                    $.post('https://fm_phone/joinGroup', JSON.stringify({
                                        code: popUpInput
                                    }))
                                    setPopupInput('')
                                }
                            }}>Unirse</button>
                            <button onClick={() => {
                                $.post('https://fm_phone/createSingleGroup')
                                changePopUpState(false)
                            }}>Crear nuevo grupo</button>
                            <button onClick={() => {
                                changePopUpState(false)
                            }}>Cerrar</button>
                        </div>
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default Messages 