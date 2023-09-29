#!/bin/zsh

# Abre tres pestañas en la Terminal actual y ejecuta los comandos
osascript -e 'tell application "Terminal" to activate'
osascript -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using {command down}'
osascript -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using {command down}'
osascript -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using {command down}'

# Espera un breve momento para que las pestañas se abran
sleep 2

# Define los comandos que deseas ejecutar en cada pestaña
comando1="ngrok http --domain=bulldog-equal-morally.ngrok-free.app 3000"
comando2="pscale connect credicheck-dev main-2023-09-05-20-48-09 --port 3309"
comando3="yarn dev"

# Ejecuta los comandos en las pestañas correspondientes
osascript -e 'tell application "Terminal" to do script "'"${comando1}"'" in tab 1 of front window'
osascript -e 'tell application "Terminal" to do script "'"${comando2}"'" in tab 2 of front window'
osascript -e 'tell application "Terminal" to do script "'"${comando3}"'" in tab 3 of front window'
