
Tunnel http requests and responses over [hyperswarm](https://github.com/hyperswarm/hyperswarm)

Status: experimental

Maybe a similar module already exists!? If you know of one, please make an issue and give a link! 

## Usage:

On machine running an http server:

`./cli.js server <port> <swarm topic>`

Receives http requests over hyperswarm, forward to a local http server running on given port.

On another machine:

`./cli.js client <port> <swarm topic>`

Forwards local http requests on given port over hyperswarm to remote server

then make a request to `http://localhost:<port>`

`<swarm topic>` - can be any string (its hash is taken as the swarm topic) - so the more 'random', the more secure, up to 32 bytes of entropy
