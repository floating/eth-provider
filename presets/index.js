module.exports = (options = {}) => {
  return {
    injected: ['injected'],
    frame: ['ws://127.0.0.1:1248', 'http://127.0.0.1:1248'],
    direct: ['ws://127.0.0.1:8546', 'http://127.0.0.1:8545'], // IPC paths will be prepended in Node/Electron
    infura: [`wss://mainnet.infura.io/ws/v3/${options.infuraId}`, `https://mainnet.infura.io/v3/${options.infuraId}`],
    alchemy: [`wss://eth-mainnet.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-mainnet.alchemyapi.io/v2/${options.alchemyId}`],
    infuraRopsten: [`wss://ropsten.infura.io/ws/v3/${options.infuraId}`, `https://ropsten.infura.io/v3/${options.infuraId}`],
    alchemyRopsten: [`wss://eth-ropsten.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-ropsten.alchemyapi.io/v2/${options.alchemyId}`],
    infuraRinkeby: [`wss://rinkeby.infura.io/ws/v3/${options.infuraId}`, `https://rinkeby.infura.io/v3/${options.infuraId}`],
    alchemyRinkeby: [`wss://eth-rinkeby.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-rinkeby.alchemyapi.io/v2/${options.alchemyId}`],
    infuraKovan: [`wss://kovan.infura.io/ws/v3/${options.infuraId}`, `https://kovan.infura.io/v3/${options.infuraId}`],
    alchemyKovan: [`wss://eth-kovan.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-kovan.alchemyapi.io/v2/${options.alchemyId}`],
    infuraGoerli: [`wss://goerli.infura.io/ws/v3/${options.infuraId}`, `https://goerli.infura.io/ws/v3/${options.infuraId}`],
    alchemyGoerli: [`wss://eth-goerli.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-goerli.alchemyapi.io/v2/${options.alchemyId}`],
    idChain: ['wss://idchain.one/ws/'],
    xDai: ['https://rpc.xdaichain.com', 'https://dai.poa.network'],
    matic: ['https://rpc-mainnet.maticvigil.com']
  }
}
