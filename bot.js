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
    hideErrors: true,
    closeTimeout: 240000,
    checkTimeoutInterval: 30000
  })

  bot._client.on('resource_pack_send', (packet) => {
    log('📦 Принимаю ресурспак...')
    bot._client.write('resource_pack_receive', {
      hash: packet.hash,
      result: 3
    })
  })

  bot.on('login', () => log('🟢 Залогинился!'))

  bot.on('messagestr', (message) => {
    log(`💬 ${message}`)
    if (!registered && (message.toLowerCase().includes('reg') || message.toLowerCase().includes('register'))) {
      setTimeout(() => { bot.chat(`/reg ${PASSWORD} ${PASSWORD}`); registered = true }, 1000)
    }
    if (registered && (message.toLowerCase().includes('login') || message.toLowerCase().includes('пароль'))) {
      setTimeout(() => { bot.chat(`/login ${PASSWORD}`) }, 1000)
    }
  })

  bot.on('spawn', () => {
    log('✅ Бот на сервере!')
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

  bot.on('end', () => {
    log('🔄 Переподключаюсь...')
    registered = false
    setTimeout(createBot, 15000)
  })
}

log('🔌 Запуск...')
createBot()