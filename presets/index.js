module.exports = (options = {}) => {
  return {
    injected: ['injected'],
    frame: ['ws://127.0.0.1:1248', 'http://127.0.0.1:1248'],
    direct: ['ws://127.0.0.1:8546', 'http://127.0.0.1:8545'], // IPC paths will be prepended in Node/Electron
    infura: [`wss://mainnet.infura.io/ws/v3/${options.infuraId}`, `https://mainnet.infura.io/v3/${options.infuraId}`],
    alchemy: [`wss://eth-mainnet.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-mainnet.alchemyapi.io/v2/${options.alchemyId}`],
    infuraGoerli: [`wss://goerli.infura.io/ws/v3/${options.infuraId}`, `https://goerli.infura.io/v3/${options.infuraId}`],
    alchemyGoerli: [`wss://eth-goerli.ws.alchemyapi.io/v2/${options.alchemyId}`, `https://eth-goerli.alchemyapi.io/v2/${options.alchemyId}`],
    infuraPolygon: [`https://polygon-mainnet.infura.io/v3/${options.infuraId}`],
    infuraArbitrum: [`https://arbitrum-mainnet.infura.io/v3/${options.infuraId}`],
    infuraOptimism: [`https://optimism-mainnet.infura.io/v3/${options.infuraId}`],
    infuraSepolia: [`wss://sepolia.infura.io/ws/v3/${options.infuraId}`, `https://sepolia.infura.io/v3/${options.infuraId}`],
    gnosis: ['https://rpc.gnosischain.com'],
    optimism: ['https://mainnet.optimism.io']
  }
}
