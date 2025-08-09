-- FiveM Phone System Client-side Script
-- This script handles client-side phone operations and UI interactions

local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()

-- Phone state
local phoneOpen = false
local phoneData = {
    contacts = {},
    messages = {},
    emails = {},
    callLogs = {},
    settings = {}
}

-- Register net events
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
    TriggerServerEvent('phone:server:getContacts')
    TriggerServerEvent('phone:server:getSettings')
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
end)

-- Phone UI Events
RegisterNetEvent('phone:client:receiveContacts', function(contacts)
    phoneData.contacts = contacts
    if phoneOpen then
        SendNUIMessage({
            action = 'updateContacts',
            contacts = contacts
        })
    end
end)

RegisterNetEvent('phone:client:receiveMessages', function(messages)
    phoneData.messages = messages
    if phoneOpen then
        SendNUIMessage({
            action = 'updateMessages',
            messages = messages
        })
    end
end)

RegisterNetEvent('phone:client:receiveConversations', function(conversations)
    phoneData.conversations = conversations
    if phoneOpen then
        SendNUIMessage({
            action = 'updateConversations',
            conversations = conversations
        })
    end
end)

RegisterNetEvent('phone:client:receiveEmails', function(emails)
    phoneData.emails = emails
    if phoneOpen then
        SendNUIMessage({
            action = 'updateEmails',
            emails = emails
        })
    end
end)

RegisterNetEvent('phone:client:receiveSettings', function(settings)
    phoneData.settings = settings
    if phoneOpen then
        SendNUIMessage({
            action = 'updateSettings',
            settings = settings
        })
    end
end)

-- Call Events
RegisterNetEvent('phone:client:incomingCall', function(callData)
    SendNUIMessage({
        action = 'incomingCall',
        caller = callData.caller,
        number = callData.number
    })
    
    -- Play ringtone
    PlaySound(-1, "Remote_Ring", "Phone_SoundSet_Michael", 0, 0, 1)
end)

RegisterNetEvent('phone:client:outgoingCall', function(callData)
    SendNUIMessage({
        action = 'outgoingCall',
        recipient = callData.recipient,
        number = callData.number
    })
end)

RegisterNetEvent('phone:client:receiveMessage', function(messageData)
    QBCore.Functions.Notify('New message from ' .. messageData.sender, 'primary')
    
    -- Update messages if phone is open
    if phoneOpen then
        TriggerServerEvent('phone:server:getMessages')
    end
end)

RegisterNetEvent('phone:client:photoTaken', function(data)
    if phoneOpen then
        SendNUIMessage({
            action = 'photoTaken',
            success = data.success,
            photoUrl = data.photoUrl
        })
    end
end)

-- Phone Commands
RegisterCommand('phone', function()
    TogglePhone()
end, false)

RegisterKeyMapping('phone', 'Open Phone', 'keyboard', 'F1')

-- Phone Functions
function TogglePhone()
    phoneOpen = not phoneOpen
    
    if phoneOpen then
        OpenPhone()
    else
        ClosePhone()
    end
end

function OpenPhone()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openPhone',
        phoneData = phoneData
    })
    
    -- Disable controls while phone is open
    CreateThread(function()
        while phoneOpen do
            DisableControlAction(0, 1, true) -- LookLeftRight
            DisableControlAction(0, 2, true) -- LookUpDown
            DisableControlAction(0, 24, true) -- Attack
            DisableControlAction(0, 257, true) -- Attack2
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 263, true) -- MeleeAttack1
            Wait(1)
        end
    end)
end

function ClosePhone()
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'closePhone'
    })
end

-- NUI Callbacks
RegisterNUICallback('closePhone', function(data, cb)
    ClosePhone()
    cb('ok')
end)

RegisterNUICallback('makeCall', function(data, cb)
    TriggerServerEvent('phone:server:makeCall', data.number)
    cb('ok')
end)

RegisterNUICallback('sendMessage', function(data, cb)
    TriggerServerEvent('phone:server:sendMessage', data.recipient, data.message)
    cb('ok')
end)

RegisterNUICallback('addContact', function(data, cb)
    TriggerServerEvent('phone:server:addContact', data.name, data.number)
    cb('ok')
end)

RegisterNUICallback('getMessages', function(data, cb)
    TriggerServerEvent('phone:server:getMessages', data.contact)
    cb('ok')
end)

RegisterNUICallback('getEmails', function(data, cb)
    TriggerServerEvent('phone:server:getEmails')
    cb('ok')
end)

RegisterNUICallback('sendEmail', function(data, cb)
    TriggerServerEvent('phone:server:sendEmail', data.to, data.subject, data.body)
    cb('ok')
end)

RegisterNUICallback('takePhoto', function(data, cb)
    TriggerServerEvent('phone:server:takePhoto', data.flash)
    cb('ok')
end)

RegisterNUICallback('updateSetting', function(data, cb)
    TriggerServerEvent('phone:server:updateSetting', data.setting, data.value)
    cb('ok')
end)

-- Animation and prop handling
local phoneModel = `prop_phone_ing`
local phoneObject = nil

function PlayPhoneAnimation()
    local ped = PlayerPedId()
    
    RequestAnimDict("cellphone@")
    while not HasAnimDictLoaded("cellphone@") do
        Wait(1)
    end
    
    TaskPlayAnim(ped, "cellphone@", "cellphone_text_read_base", 8.0, -8.0, -1, 49, 0, false, false, false)
    
    -- Create phone prop
    RequestModel(phoneModel)
    while not HasModelLoaded(phoneModel) do
        Wait(1)
    end
    
    phoneObject = CreateObject(phoneModel, 0.0, 0.0, 0.0, true, true, false)
    AttachEntityToEntity(phoneObject, ped, GetPedBoneIndex(ped, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
end

function StopPhoneAnimation()
    local ped = PlayerPedId()
    ClearPedTasks(ped)
    
    if phoneObject then
        DeleteObject(phoneObject)
        phoneObject = nil
    end
end

-- Event handlers for animations
AddEventHandler('phone:client:openPhone', function()
    PlayPhoneAnimation()
end)

AddEventHandler('phone:client:closePhone', function()
    StopPhoneAnimation()
end)

-- Cleanup on resource stop
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        if phoneOpen then
            ClosePhone()
        end
        StopPhoneAnimation()
    end
end)

print("^2[QBox Phone] Client script loaded successfully^0")