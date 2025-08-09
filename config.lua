Config = {}

-- Phone Configuration
Config.Phone = {
    -- Default phone number format
    NumberFormat = "###-####",
    
    -- Maximum contacts per player
    MaxContacts = 100,
    
    -- Maximum messages to store per conversation
    MaxMessages = 500,
    
    -- Photo storage settings
    Photos = {
        MaxPhotos = 50,
        Quality = 85,
        MaxFileSize = 5 -- MB
    },
    
    -- Call settings
    Calls = {
        MaxCallDuration = 300, -- seconds
        RingDuration = 30 -- seconds
    },
    
    -- Email settings
    Email = {
        MaxEmails = 200,
        MaxAttachments = 5
    }
}

-- Default contacts for new players
Config.DefaultContacts = {
    {name = "Police Department", number = "911"},
    {name = "EMS", number = "912"},
    {name = "Mechanic", number = "555-0123"},
    {name = "Taxi Service", number = "555-0124"},
    {name = "City Hall", number = "555-0100"}
}

-- Default emails for new players
Config.DefaultEmails = {
    {
        sender = "City Hall",
        subject = "Welcome to Los Santos",
        body = "Welcome to Los Santos! Your phone has been activated and is ready to use. You can now make calls, send messages, and stay connected with the city.",
        isImportant = true
    },
    {
        sender = "Bank of Los Santos",
        subject = "Account Information",
        body = "Your bank account has been set up successfully. You can now manage your finances through our mobile banking app.",
        isImportant = false
    }
}

-- Phone keybind
Config.PhoneKey = "F1"

-- Animation settings
Config.Animations = {
    PhoneOut = {
        dict = "cellphone@",
        anim = "cellphone_text_read_base",
        flag = 49
    },
    PhoneCall = {
        dict = "cellphone@",
        anim = "cellphone_call_listen_base",
        flag = 49
    }
}

-- Prop settings
Config.PhoneProp = {
    model = `prop_phone_ing`,
    bone = 28422,
    offset = vector3(0.0, 0.0, 0.0),
    rotation = vector3(0.0, 0.0, 0.0)
}