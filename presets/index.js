module.exports = {
  injected: ['injected'],
  frame: ['ws://127.0.0.1:1248', 'http://127.0.0.1:1248'],
  direct: ['ws://127.0.0.1:8546', 'http://127.0.0.1:8545'], // IPC paths will be prepended in Node/Electron
  infura: ['wss://mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'],
  infuraRopsten: ['wss://ropsten.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://ropsten.infura.io/v3/786ade30f36244469480aa5c2bf0743b'],
  infuraRinkeby: ['wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://rinkeby.infura.io/v3/786ade30f36244469480aa5c2bf0743b'],
  infuraKovan: ['wss://kovan.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://kovan.infura.io/v3/786ade30f36244469480aa5c2bf0743b']
}
