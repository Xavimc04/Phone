fx_version 'cerulean'
game 'gta5'
 
author 'Core Developer'
description 'Core Developer'
 
ui_page "client/ui/build/index.html"

files {
    'client/ui/build/**/*'
}
 
client_scripts { 'client/*.lua' }
 
shared_scripts { 'config.lua' }

server_scripts { '@mysql-async/lib/MySQL.lua', 'server/*.lua' }