-- FiveM Phone System Server-side Script
-- This script handles all phone-related server operations and database interactions

local QBCore = exports['qb-core']:GetCoreObject()

-- Database tables creation
MySQL.ready(function()
    -- Contacts table
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS phone_contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            citizenid VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            number VARCHAR(20) NOT NULL,
            avatar VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_citizenid (citizenid)
        )
    ]])

    -- Messages table
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS phone_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender VARCHAR(50) NOT NULL,
            recipient VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE,
            INDEX idx_sender (sender),
            INDEX idx_recipient (recipient)
        )
    ]])

    -- Call logs table
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS phone_call_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            caller VARCHAR(50) NOT NULL,
            recipient VARCHAR(50) NOT NULL,
            call_type ENUM('incoming', 'outgoing', 'missed') NOT NULL,
            duration INT DEFAULT 0,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_caller (caller),
            INDEX idx_recipient (recipient)
        )
    ]])

    -- Emails table
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS phone_emails (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender VARCHAR(100) NOT NULL,
            recipient VARCHAR(50) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE,
            is_important BOOLEAN DEFAULT FALSE,
            attachments INT DEFAULT 0,
            INDEX idx_recipient (recipient)
        )
    ]])

    -- Photos table
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS phone_photos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            citizenid VARCHAR(50) NOT NULL,
            photo_url VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_citizenid (citizenid)
        )
    ]])

    -- Settings table
    MySQL.Async.execute([[
        CREATE TABLE IF NOT EXISTS phone_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            citizenid VARCHAR(50) NOT NULL UNIQUE,
            settings JSON NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_citizenid (citizenid)
        )
    ]])

    print("^2[QBox Phone] Database tables initialized successfully^0")
end)

-- Utility functions
local function GetPlayerByCitizenId(citizenid)
    local players = QBCore.Functions.GetPlayers()
    for _, playerId in pairs(players) do
        local player = QBCore.Functions.GetPlayer(playerId)
        if player and player.PlayerData.citizenid == citizenid then
            return player
        end
    end
    return nil
end

local function GetPlayerPhoneNumber(citizenid)
    local player = GetPlayerByCitizenId(citizenid)
    if player then
        return player.PlayerData.charinfo.phone
    end
    return nil
end

-- Phone Contacts API
RegisterNetEvent('phone:server:getContacts', function()
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    MySQL.Async.fetchAll('SELECT * FROM phone_contacts WHERE citizenid = ?', {
        player.PlayerData.citizenid
    }, function(result)
        TriggerClientEvent('phone:client:receiveContacts', src, result)
    end)
end)

RegisterNetEvent('phone:server:addContact', function(name, number)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    MySQL.Async.insert('INSERT INTO phone_contacts (citizenid, name, number) VALUES (?, ?, ?)', {
        player.PlayerData.citizenid,
        name,
        number
    }, function(insertId)
        if insertId then
            TriggerClientEvent('QBCore:Notify', src, 'Contact added successfully', 'success')
            TriggerEvent('phone:server:getContacts')
        else
            TriggerClientEvent('QBCore:Notify', src, 'Failed to add contact', 'error')
        end
    end)
end)

-- Phone Calls API
RegisterNetEvent('phone:server:makeCall', function(targetNumber)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    -- Find target player by phone number
    local players = QBCore.Functions.GetPlayers()
    local targetPlayer = nil
    
    for _, playerId in pairs(players) do
        local target = QBCore.Functions.GetPlayer(playerId)
        if target and target.PlayerData.charinfo.phone == targetNumber then
            targetPlayer = target
            break
        end
    end

    if targetPlayer then
        -- Log the call
        MySQL.Async.insert('INSERT INTO phone_call_logs (caller, recipient, call_type) VALUES (?, ?, ?)', {
            player.PlayerData.citizenid,
            targetPlayer.PlayerData.citizenid,
            'outgoing'
        })

        MySQL.Async.insert('INSERT INTO phone_call_logs (caller, recipient, call_type) VALUES (?, ?, ?)', {
            targetPlayer.PlayerData.citizenid,
            player.PlayerData.citizenid,
            'incoming'
        })

        -- Notify both players
        TriggerClientEvent('phone:client:incomingCall', targetPlayer.PlayerData.source, {
            caller = player.PlayerData.charinfo.firstname .. ' ' .. player.PlayerData.charinfo.lastname,
            number = player.PlayerData.charinfo.phone
        })
        
        TriggerClientEvent('phone:client:outgoingCall', src, {
            recipient = targetPlayer.PlayerData.charinfo.firstname .. ' ' .. targetPlayer.PlayerData.charinfo.lastname,
            number = targetNumber
        })
    else
        TriggerClientEvent('QBCore:Notify', src, 'Number not available', 'error')
    end
end)

-- Messages API
RegisterNetEvent('phone:server:sendMessage', function(recipient, message)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    -- Find recipient by phone number
    local players = QBCore.Functions.GetPlayers()
    local targetPlayer = nil
    
    for _, playerId in pairs(players) do
        local target = QBCore.Functions.GetPlayer(playerId)
        if target and target.PlayerData.charinfo.phone == recipient then
            targetPlayer = target
            break
        end
    end

    if targetPlayer then
        MySQL.Async.insert('INSERT INTO phone_messages (sender, recipient, message) VALUES (?, ?, ?)', {
            player.PlayerData.citizenid,
            targetPlayer.PlayerData.citizenid,
            message
        }, function(insertId)
            if insertId then
                -- Notify recipient
                TriggerClientEvent('phone:client:receiveMessage', targetPlayer.PlayerData.source, {
                    sender = player.PlayerData.charinfo.firstname .. ' ' .. player.PlayerData.charinfo.lastname,
                    message = message,
                    timestamp = os.date('%H:%M')
                })
                
                TriggerClientEvent('QBCore:Notify', src, 'Message sent', 'success')
            end
        end)
    else
        TriggerClientEvent('QBCore:Notify', src, 'Recipient not found', 'error')
    end
end)

RegisterNetEvent('phone:server:getMessages', function(contact)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    if contact then
        -- Get messages with specific contact
        MySQL.Async.fetchAll([[
            SELECT m.*, 
                   CASE 
                       WHEN m.sender = ? THEN 'You'
                       ELSE (SELECT CONCAT(p.firstname, ' ', p.lastname) FROM players p WHERE p.citizenid = m.sender)
                   END as sender_name
            FROM phone_messages m 
            WHERE (m.sender = ? AND m.recipient = (SELECT citizenid FROM players WHERE CONCAT(firstname, ' ', lastname) = ?))
               OR (m.recipient = ? AND m.sender = (SELECT citizenid FROM players WHERE CONCAT(firstname, ' ', lastname) = ?))
            ORDER BY m.timestamp ASC
        ]], {
            player.PlayerData.citizenid,
            player.PlayerData.citizenid,
            contact,
            player.PlayerData.citizenid,
            contact
        }, function(result)
            TriggerClientEvent('phone:client:receiveMessages', src, result)
        end)
    else
        -- Get conversation list
        MySQL.Async.fetchAll([[
            SELECT DISTINCT
                CASE 
                    WHEN m.sender = ? THEN m.recipient
                    ELSE m.sender
                END as contact_id,
                (SELECT CONCAT(p.firstname, ' ', p.lastname) FROM players p WHERE p.citizenid = 
                    CASE WHEN m.sender = ? THEN m.recipient ELSE m.sender END
                ) as contact_name,
                m.message as last_message,
                m.timestamp,
                COUNT(CASE WHEN m.recipient = ? AND m.is_read = FALSE THEN 1 END) as unread_count
            FROM phone_messages m
            WHERE m.sender = ? OR m.recipient = ?
            GROUP BY contact_id
            ORDER BY m.timestamp DESC
        ]], {
            player.PlayerData.citizenid,
            player.PlayerData.citizenid,
            player.PlayerData.citizenid,
            player.PlayerData.citizenid,
            player.PlayerData.citizenid
        }, function(result)
            TriggerClientEvent('phone:client:receiveConversations', src, result)
        end)
    end
end)

-- Email API
RegisterNetEvent('phone:server:getEmails', function()
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    MySQL.Async.fetchAll('SELECT * FROM phone_emails WHERE recipient = ? ORDER BY timestamp DESC', {
        player.PlayerData.citizenid
    }, function(result)
        TriggerClientEvent('phone:client:receiveEmails', src, result)
    end)
end)

RegisterNetEvent('phone:server:sendEmail', function(to, subject, body)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    MySQL.Async.insert('INSERT INTO phone_emails (sender, recipient, subject, body) VALUES (?, ?, ?, ?)', {
        player.PlayerData.charinfo.firstname .. ' ' .. player.PlayerData.charinfo.lastname,
        to,
        subject,
        body
    }, function(insertId)
        if insertId then
            TriggerClientEvent('QBCore:Notify', src, 'Email sent successfully', 'success')
        else
            TriggerClientEvent('QBCore:Notify', src, 'Failed to send email', 'error')
        end
    end)
end)

-- Camera API
RegisterNetEvent('phone:server:takePhoto', function(flash)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    -- Generate photo URL (in real implementation, this would save the actual photo)
    local photoUrl = 'https://picsum.photos/400/600?random=' .. os.time()
    
    MySQL.Async.insert('INSERT INTO phone_photos (citizenid, photo_url) VALUES (?, ?)', {
        player.PlayerData.citizenid,
        photoUrl
    }, function(insertId)
        if insertId then
            TriggerClientEvent('phone:client:photoTaken', src, {
                success = true,
                photoUrl = photoUrl
            })
        end
    end)
end)

-- Settings API
RegisterNetEvent('phone:server:updateSetting', function(setting, value)
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    MySQL.Async.fetchSingle('SELECT settings FROM phone_settings WHERE citizenid = ?', {
        player.PlayerData.citizenid
    }, function(result)
        local settings = {}
        if result then
            settings = json.decode(result.settings) or {}
        end
        
        settings[setting] = value
        
        MySQL.Async.execute([[
            INSERT INTO phone_settings (citizenid, settings) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE settings = VALUES(settings)
        ]], {
            player.PlayerData.citizenid,
            json.encode(settings)
        })
    end)
end)

RegisterNetEvent('phone:server:getSettings', function()
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    MySQL.Async.fetchSingle('SELECT settings FROM phone_settings WHERE citizenid = ?', {
        player.PlayerData.citizenid
    }, function(result)
        local settings = {}
        if result then
            settings = json.decode(result.settings) or {}
        end
        TriggerClientEvent('phone:client:receiveSettings', src, settings)
    end)
end)

-- HTTP endpoints for web interface
local function SetupHTTPRoutes()
    -- Contacts endpoint
    RegisterNetEvent('__cfx_internal:httpResponse')
    
    -- This would be handled by your resource's HTTP server
    -- Example implementation would go here for web interface integration
end

-- Initialize default contacts and emails for new players
RegisterNetEvent('QBCore:Server:PlayerLoaded', function()
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end

    -- Check if player has default contacts
    MySQL.Async.fetchAll('SELECT COUNT(*) as count FROM phone_contacts WHERE citizenid = ?', {
        player.PlayerData.citizenid
    }, function(result)
        if result[1].count == 0 then
            -- Add default contacts
            local defaultContacts = {
                {name = 'Police Department', number = '911'},
                {name = 'EMS', number = '912'},
                {name = 'Mechanic', number = '555-0123'},
                {name = 'Taxi Service', number = '555-0124'}
            }
            
            for _, contact in pairs(defaultContacts) do
                MySQL.Async.insert('INSERT INTO phone_contacts (citizenid, name, number) VALUES (?, ?, ?)', {
                    player.PlayerData.citizenid,
                    contact.name,
                    contact.number
                })
            end
        end
    end)

    -- Add welcome email
    MySQL.Async.fetchAll('SELECT COUNT(*) as count FROM phone_emails WHERE recipient = ?', {
        player.PlayerData.citizenid
    }, function(result)
        if result[1].count == 0 then
            MySQL.Async.insert('INSERT INTO phone_emails (sender, recipient, subject, body, is_important) VALUES (?, ?, ?, ?, ?)', {
                'City Hall',
                player.PlayerData.citizenid,
                'Welcome to Los Santos',
                'Welcome to Los Santos! Your phone has been activated and is ready to use. You can now make calls, send messages, and stay connected with the city.',
                true
            })
        end
    end)
end)

print("^2[QBox Phone] Server script loaded successfully^0")