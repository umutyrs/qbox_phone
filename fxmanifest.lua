fx_version 'cerulean'
game 'gta5'

name 'qbox-phone'
description 'Advanced Phone System for FiveM with React UI'
author 'QBox Development'
version '1.0.0'

ui_page 'web/build/index.html'

shared_scripts {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'config.lua'
}

client_scripts {
    'lua/client.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'lua/server.lua'
}

files {
    'web/build/index.html',
    'web/build/**/*'
}

dependencies {
    'qb-core',
    'oxmysql'
}

lua54 'yes'