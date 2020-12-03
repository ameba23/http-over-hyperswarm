const hyperswarm = require('hyperswarm')
const net = require('net')

const swarm = hyperswarm()

module.exports = function (topic, port) {
  let openSwarmConnection
  let openHttpConnection

  const server = net.createServer((connection) => {
    openHttpConnection = connection
    connection.on('data', (data) => {
      console.log(data.toString())
      if (openSwarmConnection) openSwarmConnection.write(data)
    })
    connection.on('end', () => {
      openHttpConnection = false
    })
  })

  server.on('error', (err) => {
    throw err
  })

  server.listen(port, () => {
    console.log(`Listening on ${port}`)
  })

  swarm.on('connection', (connection) => {
    console.log('swarm connection')
    openSwarmConnection = connection
    connection.on('data', (data) => {
      if (openHttpConnection) openHttpConnection.write(data)
    })
  })
  swarm.join(topic, { announce: false, lookup: true })
}
