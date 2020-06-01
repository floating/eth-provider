module.exports = (options = {}) => {
  return {
    injected: ['injected'],
    frame: ['ws://127.0.0.1:1248', 'http://127.0.0.1:1248'],
    direct: ['ws://127.0.0.1:8546', 'http://127.0.0.1:8545'], // IPC paths will be prepended in Node/Electron
    infura: [`wss://mainnet.infura.io/ws/v3/${options.infuraId}`, `https://mainnet.infura.io/v3/${options.infuraId}`],
    infuraRopsten: [`wss://ropsten.infura.io/ws/v3/${options.infuraId}`, `https://ropsten.infura.io/v3/${options.infuraId}`],
    infuraRinkeby: [`wss://rinkeby.infura.io/ws/v3/${options.infuraId}`, `https://rinkeby.infura.io/v3/${options.infuraId}`],
    infuraKovan: [`wss://kovan.infura.io/ws/v3/${options.infuraId}`, `https://kovan.infura.io/v3/${options.infuraId}`]
  }
}
