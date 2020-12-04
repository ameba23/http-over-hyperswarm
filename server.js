const hyperswarm = require('hyperswarm')
const net = require('net')
// const { pipeline } = require('stream')
const swarm = hyperswarm()

module.exports = function (topic, port) {
  swarm.on('connection', (connection) => {
    console.log('swarm connection')
    const client = net.createConnection({ port }, () => {
      connection.on('data', (data) => {
        client.write(data)
      })
      client.on('data', (data) => {
        connection.write(data)
      })
      connection.on('end', () => {
        client.end()
      })
    })
    client.on('error', (err) => {
      console.error(err)
    })
  })
  swarm.join(topic, { announce: true, lookup: false })
  console.log('Forwarding requests to port', port)
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
