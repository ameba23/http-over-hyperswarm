const hyperswarm = require('hyperswarm')
const net = require('net')

const swarm = hyperswarm()

module.exports = function (topic, port = 3001) {
  let swarmConnection

  const server = net.createServer((connection) => {
    if (swarmConnection) {
      connection.on('data', (data) => {
        console.log(data.toString())
        swarmConnection.write(data)
      })
      connection.on('end', () => {
        console.log('ending')
        // remove this listener?
      })
      swarmConnection.on('data', (data) => {
        if (!connection.destroyed) connection.write(data)
      })
      swarmConnection.on('close', () => {
        connection.end()
      })
      connection.on('error', (err) => {
        console.error(err)
      })
    }
  })

  server.on('error', (err) => {
    throw err
  })

  server.listen(port, () => {
    console.log(`Listening on ${port}`)
  })

  swarm.on('connection', (connection) => {
    console.log('swarm connection')
    swarmConnection = connection
  })
  swarm.join(topic, { announce: false, lookup: true })
  logEvents(swarm)
}

function logEvents (emitter, name) {
  const emit = emitter.emit
  name = name ? `(${name}) ` : ''
  emitter.emit = (...args) => {
    // console.log(`\x1b[33m${args[0]}\x1b[0m`, util.inspect(args.slice(1), { depth: 1, colors: true }))
    console.log(`\x1b[33m${args[0]}\x1b[0m`)
    emit.apply(emitter, args)
  }
}
