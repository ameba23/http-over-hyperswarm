const hyperswarm = require('hyperswarm')
const net = require('net')

const swarm = hyperswarm()

module.exports = function (topic, port) {
  swarm.on('connection', (connection) => {
    console.log('swarm connection')
    connection.on('data', (data) => {
      const client = net.createConnection({ port }, () => {
        client.write(data)
      })
      client.on('data', (data) => {
        connection.write(data)
        client.end()
      })
    })
  })
  swarm.join(topic, { announce: true, lookup: false })
}
