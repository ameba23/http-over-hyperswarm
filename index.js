const http = require('http')
const hyperswarm = require('hyperswarm')
const { pipeline } = require('stream')
const net = require('net')

const topic = Buffer.from('35af4e91e4627f604877c647bddbba67d146fdddc1b2ebce5e9d07f5d6e2e4f4', 'hex')

const swarm = hyperswarm()

if (process.argv[2] === 'server') {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('okay', process.argv[2])
  })

  swarm.on('connection', (connection) => {
    console.log('swarm connection')
    connection.on('data', (data) => {
      const client = net.createConnection({ port: 3001 }, () => {
        console.log('connected to server!')
        client.write(data)
      })
      client.on('data', (data) => {
        connection.write(data)
        client.end()
      })
      client.on('end', () => {
        console.log('disconnected from server')
      })
    })
  })
  server.listen(3001)
  swarm.join(topic, { announce: true, lookup: false })
} else { // the client
  let openSwarmConnection
  let openhttpConnection
  const server = net.createServer((connection) => {
    console.log('client connected')
    openhttpConnection = connection
    connection.on('end', () => {
      console.log('client disconnected')
    })
    connection.on('data', (data) => {
      console.log(data.toString())
      if (openSwarmConnection) openSwarmConnection.write(data)
    })
  })
  server.on('error', (err) => {
    throw err
  })
  server.listen(3002, () => {
    console.log('server bound')
  })
  swarm.on('connection', (connection) => {
    console.log('connected...')
    openSwarmConnection = connection
    connection.on('data', (data) => {
      if (openhttpConnection) openhttpConnection.write(data)
    })
  })
  swarm.join(topic, { announce: false, lookup: true })
}
