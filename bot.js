const mineflayer = require('mineflayer')

const config = {
  host: 'StealBrainrot.play.hosting',
  port: 25565,
  username: 'KeepAliveBot',
  version: '1.21.4',
  hideErrors: true,
  closeTimeout: 240000
}

const PASSWORD = 'Bot12345'
let registered = false

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

log('🔌 Подключаюсь к серверу...')

function createBot() {
  const bot = mineflayer.createBot(config)

  log('📡 Создаю соединение...')

  bot._client.on('connect', () => {
    log('🔗 TCP соединение установлено')
    setTimeout(() => {
      if (!bot.entity) {
        log('⏱️ Сервер не ответил, переподключаюсь...')
        bot.end()
      }
    }, 10000)
  })

  bot._client.on('resource_pack_send', (packet) => {
    log('📦 Сервер отправил ресурспак, принимаю...')
    bot._client.write('resource_pack_receive', {
      hash: packet.hash,
      result: 3
    })
    log('✅ Ресурспак принят')
  })

  bot.on('login', () => {
    log('🟢 Залогинился на сервере!')
  })

  bot.on('messagestr', (message) => {
    log(`💬 ${message}`)

    if (message.toLowerCase().includes('register') ||
        message.toLowerCase().includes('reg') ||
        message.toLowerCase().includes('зарегистрир')) {
      if (!registered) {
        setTimeout(() => {
          bot.chat(`/reg ${PASSWORD} ${PASSWORD}`)
          log('📝 Отправил регистрацию')
          registered = true
        }, 1000)
      }
    }

    if (message.toLowerCase().includes('login') ||
        message.toLowerCase().includes('пароль') ||
        message.toLowerCase().includes('войди')) {
      if (registered) {
        setTimeout(() => {
          bot.chat(`/login ${PASSWORD}`)
          log('🔑 Отправил пароль')
        }, 1000)
      }
    }
  })

  bot.on('spawn', () => {
    log('✅ Бот заспавнился на сервере!')
    setInterval(() => {
      bot.setControlState('forward', true)
      setTimeout(() => bot.setControlState('forward', false), 1000)
    }, 30000)
  })

  bot.on('kicked', (reason) => {
    log(`❌ Кикнут: ${reason}`)
    registered = false
    setTimeout(createBot, 10000)
  })

  bot.on('error', (err) => {
    log(`⚠️ Ошибка: ${err.message}`)
    setTimeout(createBot, 15000)
  })

  bot.on('end', () => {
    log('🔄 Соединение закрыто, переподключаюсь...')
    registered = false
    setTimeout(createBot, 15000)
  })
}

createBot()