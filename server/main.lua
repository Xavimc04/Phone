Core = exports['fmcore']:getCoreData()

if Core.UsableItems['phone'] == nil then 
    Core.Functions.RegisterUsableItem('phone', function(src, slot) 
        local Player = Core.Functions.GetPlayerById(src) 
        TriggerClientEvent('phone:open', Player.source, slot)
    end)
end

RegisterCommand('createPhone', function(source, args)
    local Player = Core.Functions.GetPlayerById(source)

    if Player.getRank() ~= 'user' then 
        local created = CreatePhone()

        if created then 
            Player.addInventoryItem('phone', 1, { identifier = tostring(created) })
        end
    end
end)

Core.RegisterCallback('phone:getphone', function(source, cb, phone)
    local phone = MySQL.Sync.fetchAll('SELECT * FROM phones WHERE number = @number', {
        ['@number'] = tostring(phone)
    })

    if phone[1] then  
        local decoded = {
            number = phone[1].number, 
            password = phone[1].password,  
            contacts = json.decode(phone[1].contacts),
            gallery = json.decode(phone[1].gallery), 
            chats = {}, 
            data = json.decode(phone[1].data), 
        } 

        cb(decoded)
        UpdateClientChats()
    else 
        cb(false)
    end
end)

CreatePhone = function()
    local phoneNumber = math.random(100000000, 900000000)
    local doesExist = MySQL.Sync.fetchAll('SELECT * FROM phones WHERE number = @number', {
        ['@number'] = tostring(phoneNumber)
    })

    if doesExist[1] then
        return CreatePhone()
    else
        local done = MySQL.Sync.execute('INSERT INTO phones(number, password, contacts, gallery, data) VALUES(@number, @password, @contacts, @gallery, @data)', {
            ['@number'] = tostring(phoneNumber), 
            ['@password'] = 0,  
            ['@contacts'] = json.encode({}), 
            ['@gallery'] = json.encode({}),
            ['@data'] = json.encode({
                brightness = 100, 
                battery = 100, 
                wallpaperURL = 'https://i.imgur.com/2kwzDhS.jpg', 
                wifi = true, 
                mobiledata = true, 
                notify = false, 
                volume = 100, 
                pincode = 'none', 
                apps = {}, 
                profilePicture = 'none', 
            })
        })

        if done then 
            return phoneNumber
        end
    end
end

UpdatePhone = function(src, nmb)
    local phone = MySQL.Sync.fetchAll('SELECT * FROM phones WHERE number = @number', {
        ['@number'] = tostring(nmb)
    })

    if phone[1] then  
        local decoded = {
            number = phone[1].number, 
            password = phone[1].password, 
            contacts = json.decode(phone[1].contacts),
            gallery = json.decode(phone[1].gallery), 
            chats = {}, 
            data = json.decode(phone[1].data), 
        } 

        TriggerClientEvent('phone:update', src, decoded) 
    end
end

RegisterContact = function(source, index, targetNumber, targetLabel)
    local src = source 
    local phone = MySQL.Sync.fetchAll('SELECT * FROM phones WHERE number = @number', {
        ['@number'] = tostring(index)
    })

    if tostring(targetNumber) ~= tostring(index) then 
        if phone[1] then   
            local decoded = json.decode(phone[1].contacts)
    
            if not decoded[targetNumber] then  
                local targetPhone = MySQL.Sync.fetchAll('SELECT data FROM phones WHERE number = @number', {
                    ['@number'] = tostring(targetNumber)
                })
    
                if(targetPhone[1]) then  
                    local data = json.decode(targetPhone[1].data) 

                    table.insert(decoded, {
                        image = data.profilePicture, 
                        label = targetLabel, 
                        number = targetNumber
                    })
    
                    local done = MySQL.Sync.execute('UPDATE phones SET contacts = @contacts WHERE number = @number', {
                        ['@number'] = tostring(index), 
                        ['@contacts'] = json.encode(decoded)
                    })
    
                    if done then 
                        UpdatePhone(src, index)
                    end
                end
            end
        end 
    end
end  

UpdateClientChats = function(grpId)
    local grpId = grpId or nil 
    local chats = MySQL.Sync.fetchAll('SELECT * FROM phone_chats')

    for i,v in pairs(chats) do 
        chats[i].members = json.decode(chats[i].members)
        chats[i].data = json.decode(chats[i].data)
        chats[i].messages = json.decode(chats[i].messages)
    end 

    TriggerClientEvent('phone:updateChats', -1, chats, grpId)
end

RegisterNetEvent('phone:removeBattery', function(data)
    local src = source 

    if data.data.battery > 0 then  
        data.data.battery = data.data.battery - 1 
    end 

    local done = MySQL.Sync.execute('UPDATE phones SET data = @data WHERE number = @number', {
        ['@number'] = tostring(data.number), 
        ['@data'] = json.encode(data.data)
    }) 

    if done then 
        UpdatePhone(src, data.number)
    end
end)

RegisterNetEvent('phone:updatepin', function(data, phonenumber, pin)
    local src = source 

    if data.data.pincode then 
        if data.data.pincode then  
            data.data.pincode = tostring(pin) 
        end 
    else
        data.data.pincode = tostring(pin) 
    end

    local done = MySQL.Sync.execute('UPDATE phones SET data = @data WHERE number = @number', {
        ['@number'] = tostring(data.number), 
        ['@data'] = json.encode(data.data)
    }) 

    if done then 
        UpdatePhone(src, data.number)
    end
end)

RegisterNetEvent('phone:createContact', function(index, targetNumber, targetLabel)
    RegisterContact(source, index, targetNumber, targetLabel)
end)   

RegisterNetEvent('phone:reloadContact', function(index, targetNumber)
    local src = source 
    local phone = MySQL.Sync.fetchAll('SELECT contacts FROM phones WHERE number = @number', {
        ['@number'] = tostring(index)
    })

    if phone[1] then 
        local decoded = json.decode(phone[1].contacts)

        local targetPhone = MySQL.Sync.fetchAll('SELECT * FROM phones WHERE number = @number', {
            ['@number'] = tostring(targetNumber)
        }) 

        if(targetPhone[1]) then   
            local data = json.decode(targetPhone[1].data)

            for i,v in pairs(decoded) do 
                if v.number == targetPhone[1].number then 
                    decoded[i].image = data.profilePicture 
                end
            end 

            local done = MySQL.Sync.execute('UPDATE phones SET contacts = @contacts WHERE number = @number', {
                ['@number'] = tostring(index), 
                ['@contacts'] = json.encode(decoded)
            })

            if done then  
                UpdatePhone(src, index)
            end
        end 
    end
end)   

RegisterNetEvent('phone:updateProfilePicture', function(index, newPicture)
    local src = source 
    local phone = MySQL.Sync.fetchAll('SELECT data FROM phones WHERE number = @number', {
        ['@number'] = tostring(index)
    })

    if phone[1] then 
        local decoded = json.decode(phone[1].data)

        decoded.profilePicture = newPicture 
        
        local done = MySQL.Sync.execute('UPDATE phones SET data = @data WHERE number = @number', {
            ['@number'] = tostring(index), 
            ['@data'] = json.encode(decoded)
        }) 
    
        if done then 
            UpdatePhone(src, index)
        end
    end
end)   

RegisterNetEvent('phone:insertIntoGallery', function(index, imageURL)
    local src = source 
    local phone = MySQL.Sync.fetchAll('SELECT gallery FROM phones WHERE number = @number', {
        ['@number'] = tostring(index)
    })

    if phone[1] then 
        local decoded = json.decode(phone[1].gallery)

        decoded[#decoded + 1] = { url = imageURL, index = #decoded + 1, label = 'Sin nombre', date = os.date('%x') } 
        
        local done = MySQL.Sync.execute('UPDATE phones SET gallery = @gallery WHERE number = @number', {
            ['@number'] = tostring(index), 
            ['@gallery'] = json.encode(decoded)
        }) 
    
        if done then 
            UpdatePhone(src, index)
        end
    end
end)  

RegisterNetEvent('phone:renameImage', function(index, label, imgIndex)
    local src = source 
    local phone = MySQL.Sync.fetchAll('SELECT gallery FROM phones WHERE number = @number', {
        ['@number'] = tostring(index)
    })

    if phone[1] then 
        local decoded = json.decode(phone[1].gallery)

        decoded[imgIndex].label = label 

        local done = MySQL.Sync.execute('UPDATE phones SET gallery = @gallery WHERE number = @number', {
            ['@number'] = tostring(index), 
            ['@gallery'] = json.encode(decoded)
        }) 
    
        if done then 
            UpdatePhone(src, index)
        end
    end
end)  

RegisterNetEvent('phone:deleteImage', function(index, imgIndex)
    local src = source 
    local phone = MySQL.Sync.fetchAll('SELECT gallery FROM phones WHERE number = @number', {
        ['@number'] = tostring(index)
    })

    if phone[1] then  
        local decoded = json.decode(phone[1].gallery)

        local provTable = {}
        
        for i,v in pairs(decoded) do  
            if v.index ~= imgIndex then 
                provTable[i] = v  
            end
        end 

        local done = MySQL.Sync.execute('UPDATE phones SET gallery = @gallery WHERE number = @number', {
            ['@number'] = tostring(index), 
            ['@gallery'] = json.encode(provTable)
        }) 
    
        if done then 
            UpdatePhone(src, index)
        end
    end
end)  

RegisterNetEvent('phone:createPrivateChat', function(index, targetPhone)
    local src = source 
    local randomId = math.random(1000000, 9000000)

    local privateChats = MySQL.Sync.fetchAll('SELECT members FROM phone_chats')

    local firstFounded, secondFounded = false, false 

    for i,v in pairs(privateChats) do 
        local decodedMembers = json.decode(v.members)

        if #decodedMembers == 2 then 
            for b,c in pairs(decodedMembers) do 
                if c.number == index then 
                    firstFounded = true 
                end 

                if c.number == targetPhone then 
                    secondFounded = true 
                end
            end
        end
    end
    
    if not firstFounded and not secondFounded then 
        if index and targetPhone then 
            local done = MySQL.Sync.execute('INSERT INTO phone_chats(id, members, messages, data) VALUES(@id, @members, @messages, @data)', {
                ['@id'] = randomId,  
                ['@members'] = json.encode({
                    {
                        number = index,
                        rank = 'admin'
                    }, 
                    {
                        number = targetPhone, 
                        rank = 'user'
                    }
                }), 
                ['@messages'] = json.encode({}),
                ['@data'] = json.encode({
                    profilePicture = 'none', 
                    code = randomId, 
                    label = tostring('Chat privado ('..randomId..')'),
                }), 
            })
    
            if done then 
                UpdateClientChats() 
            end
        end 
    end 
end)

RegisterNetEvent('phone:sendMessageToGrp', function(index, grpId, message, msgData)
    local src = source 
    local chatList = MySQL.Sync.fetchAll('SELECT messages FROM phone_chats WHERE id = @id', {
        ['@id'] = tonumber(grpId)
    })

    local decoded = json.decode(chatList[1].messages)

    table.insert(decoded, {
        id = #decoded + 1, 
        extra = msgData or nil, 
        sender = index,  
        date = os.date('%H:%M'), 
        content = message 
    }) 

    local done = MySQL.Sync.execute('UPDATE phone_chats SET messages = @messages WHERE id = @id', {
        ['@id'] = tostring(grpId), 
        ['@messages'] = json.encode(decoded)
    }) 

    if done then 
        UpdateClientChats(grpId)
    end
end)

RegisterNetEvent('phone:updateData', function(number, data) 
    local src = source 
    local done = MySQL.Sync.execute('UPDATE phones SET data = @data WHERE number = @number', {
        ['@number'] = tostring(number), 
        ['@data'] = json.encode(data)
    }) 

    if done then 
        UpdatePhone(src, number)
    end
end)

RegisterNetEvent('phone:customChatData', function(id, name, code, image) 
    local src = source 
    local done = MySQL.Sync.execute('UPDATE phone_chats SET data = @data WHERE id = @id', {
        ['@id'] = tonumber(id), 
        ['@data'] = json.encode({
            profilePicture = image, 
            label = name, 
            code = id 
        })
    })
    
    if done then 
        UpdateClientChats()
    end
end)

RegisterNetEvent('phone:kickFromGroup', function(id, targetPhone, members) 
    local src = source 

    for i,v in pairs(members) do 
        if v.number == targetPhone then 
            table.remove(members, i)
        end
    end

    local done = MySQL.Sync.execute('UPDATE phone_chats SET members = @members WHERE id = @id', {
        ['@id'] = tonumber(id), 
        ['@members'] = json.encode(members)
    })
    
    if done then 
        UpdateClientChats()
    end
end)

RegisterNetEvent('phone:createSingleGroup', function(index)
    local src = source 
    local randomId = math.random(1000000, 9000000)

    if index then 
        local function Create()
            local done = MySQL.Sync.execute('INSERT INTO phone_chats(id, members, messages, data) VALUES(@id, @members, @messages, @data)', {
                ['@id'] = randomId,  
                ['@members'] = json.encode({
                    {
                        number = index,
                        rank = 'admin'
                    } 
                }), 
                ['@messages'] = json.encode({}),
                ['@data'] = json.encode({
                    profilePicture = 'none', 
                    code = randomId, 
                    label = tostring('Grupo ('..randomId..')'),
                }), 
            })
    
            if done then 
                UpdateClientChats() 
            else 
                Create()
            end
        end

        Create()
    end 
end)

RegisterNetEvent('phone:joinGroup', function(id, members)
    local done = MySQL.Sync.execute('UPDATE phone_chats SET members = @members WHERE id = @id', {
        ['@id'] = tonumber(id), 
        ['@members'] = json.encode(members)
    })
    
    if done then  
        UpdateClientChats()
    end
end)

RegisterNetEvent('phone:installApp', function(phoneData, app)
    local src = source 

    if phoneData.data.apps then 
        phoneData.data.apps[app] = true 
    else
        phoneData.data.apps = {} 
        phoneData.data.apps[app] = true 
    end

    local done = MySQL.Sync.execute('UPDATE phones SET data = @data WHERE number = @number', {
        ['@number'] = tostring(phoneData.number), 
        ['@data'] = json.encode(phoneData.data)
    }) 
    
    if done then  
        UpdatePhone(src, phoneData.number)
    end
end)

RegisterNetEvent('phone:callPlayer', function(index, target)
    TriggerClientEvent('phone:createCall', -1, index, target)
end)

RegisterNetEvent('phone:acceptCall', function(receiver, caller) 
    TriggerClientEvent('phone:enableVoiceToCall', -1, receiver, caller)
end)

RegisterNetEvent('phone:hangCall', function(first, second)  
    TriggerClientEvent('phone:hangForAll', -1, first, second)
end)