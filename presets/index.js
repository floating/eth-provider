module.exports = {
  injected: ['injected'],
  frame: ['ws://127.0.0.1:1248', 'http://127.0.0.1:1248'],
  direct: ['ws://127.0.0.1:8546', 'http://127.0.0.1:8545'], // IPC paths will be prepended in Node/Electron
  infura: ['wss://mainnet.infura.io/ws', 'https://mainnet.infura.io/upS1XaBx0l4b9ntUUVQv'],
  infuraRinkeby: ['wss://rinkeby.infura.io/_ws', 'https://rinkeby.infura.io/upS1XaBx0l4b9ntUUVQv']
}
