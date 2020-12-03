#!/usr/bin/node
const server = require('./server')
const client = require('./client')
const { createHash } = require('crypto')

const topicString = process.argv[4]
const topic = sha256(topicString)
const port = process.argv[3]

if (!['server', 'client'].includes(process.argv[2])) {
  console.log(`Usage:
  ${process.argv[1]} server <port> <swarm topic>
    - receive http requests over hyperswarm, forward to a local http server running on given port.

  ${process.argv[1]} client <port> <swarm topic>
    - forward local http requests on given port over hyperswarm to remote server
`)
  process.exit(1)
}

if (process.argv[2] === 'server') {
  server(topic, port)
} else { // the client
  client(topic, port)
}

function sha256 (msg) {
  return createHash('sha256').update(msg).digest()
}
