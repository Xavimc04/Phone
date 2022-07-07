Core = exports['fmcore']:getCoreData()
hasConnection = false 
openedData = false 
isFontCameraEnabled = false
isCameraEnabled = false 
hasPendentMessages = false 
isAvailable = true 
inCall = false 
callMembers = {}
phoneChats = {}

CreateThread(function()
    while true do 
        local msec = 5000 
        local player = PlayerPedId()
        local pCoords = GetEntityCoords(player)


        for i,v in pairs(Config['connection'].props) do 
            local closest = GetClosestObjectOfType(pCoords, 300.0, GetHashKey(v), false, false, false)
            local clpos = GetEntityCoords(closest)

            if DoesEntityExist(closest) then 
                local prevState = hasConnection
                hasConnection = true 

                if hasConnection ~= prevState then
                    if not prevState and hasConnection and openedData then 
                        hasPendentMessages = false 

                        OpenPhone(openedData.number)
                    end

                    if not hasConnection and inCall then 
                        if callMembers[1] and callMembers[2] then 
                            Core.Functions.SendAlert('Ups! Parece que has entrado en una zona sin cobertura y se ha cortado la llamada...')
                            TriggerServerEvent('phone:hangCall', callMembers[1], callMembers[2])
                        end
                    end
                end
            end
        end

        Wait(msec)
    end
end)

--[[
    -- @Battery module: Unfinished (can not turn off the phone and charge it)
    
    CreateThread(function()
        while true do
            if openedData then  
                TriggerServerEvent('phone:removeBattery', openedData) 
            end  

            Wait(90000)
        end
    end)
]]

CreateThread(function()
	DestroyMobilePhone()

	while true do
		local msec = 1000 
				
        if isCameraEnabled then 
            msec = 0
            
            if IsControlJustPressed(1, 177) then  
                DestroyMobileCamera() 
            end
            
            if IsControlJustPressed(1, 27) then   
                isFontCameraEnabled = not isFontCameraEnabled
                FrontCamera(isFontCameraEnabled)
            end 

            if IsControlJustPressed(1, 18) then  
                exports['screenshot-basic']:requestScreenshotUpload(Config['webhook'], 'files[]', function(data) 
                    TriggerServerEvent('phone:insertIntoGallery', openedData.number, json.decode(data).attachments[1].url)
                    PlaySoundFrontend(-1, "Camera_Shoot", "Phone_Soundset_Franklin", 1) 
                end)
            end
                
            SetTextRenderId(GetMobilePhoneRenderId())
        end 
		
		Wait(msec)
	end
end) 

OpenPhone = function(number)
    Core.TriggerCallback('phone:getphone', function(data) 
        if(data) then 
            local first = true  

            if openedData then 
                first = false 
            end

            openedData = data   
            SetNuiFocus(true, true) 

            local formatedContacts = {}

            for i,v in pairs(openedData.contacts) do 
                table.insert(formatedContacts, v)
            end

            openedData.contacts = formatedContacts 
            
            SendNUIMessage({
                action = 'open', 
                first = first, 
                phone = data 
            })
        end
    end, number)
end

CreateMobileCamera = function()
    SetNuiFocus(false, false)
    CreateMobilePhone(0)
	CellCamActivate(true, true)
    isCameraEnabled = true 
end

DestroyMobileCamera = function()
    SetNuiFocus(true, true)
    DestroyMobilePhone() 
    CellCamActivate(false, false) 
    OpenPhone(openedData.number)
    isCameraEnabled = false 
end

FrontCamera = function(boolean)
	return Citizen.InvokeNative(0x2491A93618B7D838, boolean)
end

RegisterNetEvent('phone:open', function(slot)
    local canOpen = false
    
    for i,v in pairs(Core.Functions.GetPlayerData().inventory) do 
        if(v.slot == slot) then 
            if v.item then
                canOpen = v.info.identifier  
            end
        end
    end
    
    if canOpen then
        Wait(200)
        Core.Functions.CloseMenu()
        OpenPhone(canOpen)
    end
end)

RegisterNetEvent('phone:update', function(data)
    openedData = data 

    local formatedContacts = {}

    for i,v in pairs(openedData.contacts) do 
        table.insert(formatedContacts, v)
    end

    openedData.contacts = formatedContacts
    tempArray = {}
    
    for i,v in pairs(phoneChats) do 
        for b,c in pairs(v.members) do 
            if c.number == openedData.number then 
                table.insert(tempArray, v)
            end
        end
    end 

    openedData.chats = tempArray

    SendNUIMessage({
        action = 'open',  
        phone = openedData  
    })

    if isCameraEnabled then  
        DestroyMobileCamera()
    end
end)

RegisterNetEvent('phone:updateChats', function(chats, lastGrpId)
    if #phoneChats == 0 and openedData then
        tempArray = {}
    
        for i,v in pairs(chats) do 
            for b,c in pairs(v.members) do 
                if c.number == openedData.number then 
                    table.insert(tempArray, v)
                end
            end
        end 

        for i,v in pairs(tempArray) do 
            if v.id == tonumber(lastGrpId) then 
                Core.Functions.SendAlert('Acabas de recibir un nuevo mensaje de: ~o~'..v.data.label)
            end
        end

        openedData.chats = tempArray
        phoneChats = chats 

        SendNUIMessage({
            action = 'open', 
            phone = openedData  
        })
    else
        if openedData and hasConnection then  
            tempArray = {}
    
            for i,v in pairs(chats) do 
                for b,c in pairs(v.members) do 
                    if c.number == openedData.number then 
                        table.insert(tempArray, v)
                    end
                end
            end 

            for i,v in pairs(tempArray) do 
                if v.id == tonumber(lastGrpId) then 
                    Core.Functions.SendAlert('Acabas de recibir un nuevo mensaje de: ~o~'..v.data.label)
                end
            end
    
            openedData.chats = tempArray
            phoneChats = chats 
    
            SendNUIMessage({
                action = 'open', 
                phone = openedData  
            })
        end
    end

    if not hasConnection then 
        hasPendentMessages = true 
    end
end)

RegisterNetEvent('phone:createCall', function(index, target) 
    local isCaller, isReceiver, canCall = false, false, true  

    for i,v in pairs(Core.Functions.GetPlayerData().inventory) do 
        if v.item then 
            if v.item == 'phone' and v.info.identifier == index then 
                isCaller = true 
            end

            if v.item == 'phone' and v.info.identifier == target then 
                isReceiver = true 
            end
        end
    end
 
    if isCaller and isReceiver then 
        Core.Functions.SendAlert('Parece que tienes ambos teléfonos, por lo tanto la llamada no puede ser transmitida.')
        canCall = false 
    end 

    if canCall and isAvailable and isCaller or isReceiver then 
        local callingTimer = 15
        isAvailable = false 

        if isCaller then 
            exports['xsound']:PlayUrl("calling", "https://www.youtube.com/watch?v=gm0uIF7onB4", 1.0, false)
            SendNUIMessage({
                action = 'createcall', 
                status = 'caller', 
                callingNumber = target 
            }) 
        end

        if isReceiver then 
            exports['xsound']:PlayUrl("receivingCall", "https://www.youtube.com/watch?v=JwYAPkjb0Z4", 1.0, false)
            SendNUIMessage({
                action = 'createcall', 
                status = 'receiver', 
                callingNumber = index 
            }) 
        end

        CreateThread(function()
            while true do
                if inCall then
                    exports['xsound']:Destroy("receivingCall")
                    exports['xsound']:Destroy("calling") 
                    break 
                end
                
                if callingTimer <= 0 then  
                    isAvailable = true 

                    if not inCall then 
                        SendNUIMessage({
                            action = 'cancelcall' 
                        })
                    end
                    
                    exports['xsound']:Destroy("calling")
                    exports['xsound']:Destroy("receivingCall")

                    break 
                end

                callingTimer = callingTimer - 1
                
                Wait(1000)
            end
        end) 
    end
end)

RegisterNetEvent('phone:enableVoiceToCall', function(receiverChannel, callerChannel)
    local canCall = false   

    for i,v in pairs(Core.Functions.GetPlayerData().inventory) do 
        if v.item then 
            if v.item == 'phone' and v.info.identifier == receiverChannel then 
                canCall = true  
            end

            if v.item == 'phone' and v.info.identifier == callerChannel then 
                canCall = true  
            end
        end
    end

    if canCall then 
        inCall = true 

        callMembers[1] = receiverChannel
        callMembers[2] = callerChannel 

        exports["pma-voice"]:SetCallChannel(tonumber(callerChannel))
        NetworkSetVoiceChannel(tonumber(callerChannel))
        NetworkSetTalkerProximity(0.0)

        SendNUIMessage({
            action = 'acceptcall', 
        })  
    end 
end)

RegisterNetEvent('phone:hangForAll', function(first, second)
    local isSomeone = false 

    for i,v in pairs(Core.Functions.GetPlayerData().inventory) do 
        if v.item then 
            if v.item == 'phone' and v.info.identifier == first then 
                isSomeone = true  
            end

            if v.item == 'phone' and v.info.identifier == second then 
                isSomeone = true  
            end
        end
    end

    if isSomeone then 
        isAvailable = true 
        inCall = false 
        callMembers = {}

        exports["pma-voice"]:SetCallChannel(0)
        NetworkSetVoiceChannel(0)
        NetworkSetTalkerProximity(5.0)

        SendNUIMessage({
            action = 'cancelcall'
        })

        PlaySoundFrontend(-1, "Hang_Up", "Phone_SoundSet_Michael", 1) 
    end 
end)

RegisterNUICallback('createContact', function(data) 
    if(data.contactNumber and data.contactLabel) then  
        TriggerServerEvent('phone:createContact', data.phoneIndex, data.contactNumber, data.contactLabel)  
    end
end)

RegisterNUICallback('reloadContact', function(data) 
    if(data.targetPhone) then  
        TriggerServerEvent('phone:reloadContact', data.phoneIndex, data.targetPhone) 
        PlaySoundFrontend(-1, "Put_Away", "Phone_SoundSet_Michael", 1) 
    end
end)

RegisterNUICallback('setProfilePicture', function(data) 
    if(data.picture) then   
        TriggerServerEvent('phone:updateProfilePicture', data.phoneIndex, data.picture)  
    end
end)

RegisterNUICallback('enableCamera', function()
    SendNUIMessage({
        action = 'close' 
    })

    CreateMobileCamera()
end)

RegisterNUICallback('saveImageName', function(data)
    if(data.name and data.imgIndex) then 
        TriggerServerEvent('phone:renameImage', openedData.number, data.name, data.imgIndex)
        PlaySoundFrontend(-1, "Put_Away", "Phone_SoundSet_Michael", 1) 
    end
end)

RegisterNUICallback('deleteImage', function(data)
    if(data.imgIndex) then 
        TriggerServerEvent('phone:deleteImage', openedData.number, data.imgIndex)
        PlaySoundFrontend(-1, "Put_Away", "Phone_SoundSet_Michael", 1) 
    end
end)

RegisterNUICallback('contactToChat', function(data)
    if(data.targetPhone) then 
        TriggerServerEvent('phone:createPrivateChat', openedData.number, data.targetPhone)
    end
end)

RegisterNUICallback('messageSend', function(data)
    if(data.grpId) then 
        if hasConnection then 
            TriggerServerEvent('phone:sendMessageToGrp', openedData.number, data.grpId, data.message)
        else
            Core.Functions.SendAlert('No tienes cobertura como para enviar mensajes.')
        end 
    end
end)

RegisterNUICallback('updateWallpaper', function(data)
    if(data.url and openedData)then 
        if(openedData.data.wallpaperURL ~= data.url) then  
            openedData.data.wallpaperURL = data.url   
            TriggerServerEvent('phone:updateData', openedData.number, openedData.data)  
        end
    end
end)

RegisterNUICallback('updateGroup', function(data)
    if(data.groupId and data.groupName and data.inviteCode and data.profilePicture) then 
        TriggerServerEvent('phone:customChatData', data.groupId, data.groupName, data.inviteCode, data.profilePicture)
        PlaySoundFrontend(-1, "Put_Away", "Phone_SoundSet_Michael", 1) 
    end  
end)

RegisterNUICallback('kickFromGroup', function(data)
    if(data.grpId and data.target)then 
        TriggerServerEvent('phone:kickFromGroup', data.grpId, data.target, data.members)
        PlaySoundFrontend(-1, "Put_Away", "Phone_SoundSet_Michael", 1) 
    end
end)

RegisterNUICallback('createSingleGroup', function(data) 
    TriggerServerEvent('phone:createSingleGroup', openedData.number)
end)

RegisterNUICallback('joinGroup', function(data)
    if(data.code)then  
        for i,v in pairs(phoneChats) do 
            if tostring(v.data.code) == tostring(data.code) then  
                local decoded = v.members 
                local founded = false 
                
                for b,c in pairs(decoded) do 
                    if c.number == openedData.number then 
                        founded = true  
                    end
                end

                if not founded then  
                    table.insert(decoded, {
                        number = openedData.number, 
                        rank = 'user'
                    }) 

                    TriggerServerEvent('phone:joinGroup', v.id, decoded)
                    PlaySoundFrontend(-1, "Put_Away", "Phone_SoundSet_Michael", 1) 
                end
            end
        end
    end 
end)

RegisterNUICallback('close', function()
    if not inCall then  
        openedData = false 
    end 

    SetNuiFocus(false, false)

    SendNUIMessage({
        action = 'close' 
    })
end)

RegisterNUICallback('sendLocation', function(data)
    if(data.grpId)then 
        TriggerServerEvent('phone:sendMessageToGrp', openedData.number, data.grpId, '¡Hey, Acabo de compartir mi ubicación! Clica sobre este mensaje para marcarla en tu GPS', { type = 'location', coords = GetEntityCoords(PlayerPedId()) })
    end
end)

RegisterNUICallback('extraMessage', function(data)
    if(data.extra)then 
        if data.extra.type == 'location' then 
            SetNewWaypoint(data.extra.coords.x, data.extra.coords.y)
        end
    end
end)

RegisterNUICallback('sendImageToGroup', function(data)
    if(data.grpId and data.image)then  
        TriggerServerEvent('phone:sendMessageToGrp', openedData.number, data.grpId, data.image)
    end
end) 

RegisterNUICallback('callContact', function(data)
    if(hasConnection)then 
        TriggerServerEvent('phone:callPlayer', openedData.number, data.number)
    else
        Core.Functions.SendAlert('Lo siento, no tienes cobertura en estos momentos, inténtalo de nuevo más tarde...')
    end 
end) 

RegisterNUICallback('acceptCall', function(data) 
    TriggerServerEvent('phone:acceptCall', data.receiver, data.caller)
end) 

RegisterNUICallback('hangCall', function(data) 
    TriggerServerEvent('phone:hangCall', data.first, data.second)
end) 

RegisterNUICallback('changepin', function(data) 
    if(data.phone and data.pin)then 
        TriggerServerEvent('phone:updatepin', openedData, data.phone, data.pin)
    end 
end) 

RegisterNUICallback('installApp', function(data) 
    if(data.app)then 
        TriggerServerEvent('phone:installApp', openedData, data.app)
    end 
end) 

RegisterNUICallback('requestBankTransactions', function(data) 
    if(data.iban and data.pin)then 
        Core.TriggerCallback('banking:requestCardData', function(account)
            if account then 
                if(tostring(data.pin) == tostring(account.metadata.pin))then 
                    SendNUIMessage({
                        action = 'bank', 
                        account = account
                    })  
                end
            end
        end, data.iban)
    end 
end) 