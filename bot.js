const mineflayer = require('mineflayer')

const PASSWORD = 'Bot12345'
let registered = false

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

function createBot() {
  log('📡 Подключаюсь...')

  const bot = mineflayer.createBot({
    host: 'StealBrainrot.play.hosting',
    username: 'KeepAliveBot',
    version: '1.21.4',
    hideErrors: false,
    closeTimeout: 240000,
    checkTimeoutInterval: 60000
  })

  bot._client.on('connect', () => {
    log('🔗 TCP соединение установлено')
  })

  bot._client.on('add_resource_pack', (packet) => {
    log('🎨 Принимаю ресурспак...')
    bot._client.write('resource_pack_receive', {
      uuid: packet.uuid,
      result: 0
    })
    log('✅ Ресурспак принят')
  })

  bot.on('login', () => {
    log('🟢 Залогинился!')
    setTimeout(() => {
      log('📝 Отправляю /reg...')
      bot.chat(`/reg ${PASSWORD} ${PASSWORD}`)
    }, 3000)
    setTimeout(() => {
      log('🔑 Отправляю /login...')
      bot.chat(`/login ${PASSWORD}`)
    }, 5000)
  })

  bot.on('messagestr', (message) => {
    log(`💬 ${message}`)
  })

  bot.on('spawn', () => {
    log('✅ Бот заспавнился!')
    setInterval(() => {
      bot.setControlState('forward', true)
      setTimeout(() => bot.setControlState('forward', false), 1000)
    }, 30000)
  })

  bot.on('kicked', (reason) => {
    log(`❌ Кикнут: ${reason}`)
    registered = false
    setTimeout(createBot, 15000)
  })

  bot.on('error', (err) => {
    log(`⚠️ Ошибка: ${err.message}`)
    setTimeout(createBot, 15000)
  })

  bot.on('end', (reason) => {
    log(`🔄 Конец: ${reason}`)
    registered = false
    setTimeout(createBot, 15000)
  })
}

log('🔌 Запуск...')
createBot()