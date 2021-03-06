
Tunnel http connections over [hyperswarm](https://github.com/hyperswarm/hyperswarm)

**Status:** experimental/WIP

Maybe a similar module already exists!? If you know of one, please make an issue and give a link! 

## Why?

Maybe you are behind a NAT and want to make a http server on local host accessible over the internet.

Similar to what is offered by services like [ngrok](https://ngrok.com/) and [burrow.io](https://burrow.io/) - but without the price plan.

## Usage:

### CLI

On machine running an http server:

`./cli.js server <port> <swarm topic>`

Receives http requests over hyperswarm, forward to a local http server running on given port.

On another machine:

`./cli.js client <port> <swarm topic>`

Forwards local http requests on given port over hyperswarm to remote server

then make a request to `http://localhost:<port>`

`<swarm topic>` - can be any string (its hash is taken as the swarm topic) - so the more 'random', the more secure, up to 32 bytes of entropy

### Programmatically

`const { server, client } = require('.')`

`server(topic, port)` - tunnel to locally running http server on the given port
Topic must be a 32 byte buffer

`client(topic, port)` - tunnel local requests to the given port. (if no port is given, 3001 is used)
Topic must be a 32 byte buffer
