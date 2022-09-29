/* globals it describe */
const assert = require('assert')
const provider = require('../')
const getPresets = require('../presets')

const presetOpts = { infuraId: '786ade30f36244469480aa5c2bf0743b', alchemyId: 'NBms1eV9i16RFHpFqQxod56OLdlucIq0' }
const presets = getPresets(presetOpts)
const testablePresets = Object.keys(presets).filter((name) => !['injected', 'frame', 'direct'].includes(name))
const mainnetPresets = ['infura', 'alchemy']
const chainIdMap = {
  infura: '0x1',
  alchemy: '0x1',
  infuraRopsten: '0x3',
  alchemyRopsten: '0x3',
  infuraRinkeby: '0x4',
  alchemyRinkeby: '0x4',
  infuraKovan: '0x2a',
  alchemyKovan: '0x2a',
  infuraGoerli: '0x5',
  alchemyGoerli: '0x5',
  infuraPolygon: '0x89',
  infuraArbitrum: '0xa4b1',
  infuraOptimism: '0xa',
  infuraSepolia: '0xaa36a7',
  gnosis: '0x64',
  optimism: '0xa'
}

describe('Mainnet - sending net_version', () => {
  it('Infura HTTP Endpoint: https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
    const pro = provider(['https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
    assert(await pro.send('net_version') === '1')
    pro.close()
  }).timeout(45 * 1000)

  it('Infura WS Endpoint: wss://mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
    const pro = provider(['wss://mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
    assert(await pro.send('net_version') === '1')
    pro.close()
  }).timeout(45 * 1000)

  it('Alchemy HTTP Endpoint: https://eth-mainnet.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0', async () => {
    const pro = provider(['https://eth-mainnet.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0'])
    assert(await pro.send('net_version') === '1')
    pro.close()
  }).timeout(45 * 1000)

  it('Alchemy WS Endpoint: wss://eth-mainnet.ws.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0', async () => {
    const pro = provider(['wss://eth-mainnet.ws.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0'])
    assert(await pro.send('net_version') === '1')
    pro.close()
  }).timeout(45 * 1000)

  mainnetPresets.forEach((name) => {
    it(`preset: ${name}`, async () => {
      const pro = provider(name, presetOpts)
      assert(await pro.send('net_version') === '1')
      pro.close()
    }).timeout(45 * 1000)
  })
})

describe('All endpoints - requesting eth_chainId', () => {
  describe('Mainnet', () => {
    it('Infura HTTP Endpoint: https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider('wss://mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b')
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-mainnet.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5', async () => {
      const pro = provider('https://eth-mainnet.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5')
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-mainnet.ws.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5', async () => {
      const pro = provider(['wss://eth-mainnet.ws.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Ropsten', () => {
    it('Infura HTTP Endpoint: https://ropsten.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://ropsten.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x3')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://ropsten.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://ropsten.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x3')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-ropsten.alchemyapi.io/v2/tgVXaG0xTYT-FAUqBH8qpBZa-eF3rlgw', async () => {
      const pro = provider(['https://eth-ropsten.alchemyapi.io/v2/tgVXaG0xTYT-FAUqBH8qpBZa-eF3rlgw'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x3')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-ropsten.ws.alchemyapi.io/v2/tgVXaG0xTYT-FAUqBH8qpBZa-eF3rlgw', async () => {
      const pro = provider(['wss://eth-ropsten.ws.alchemyapi.io/v2/tgVXaG0xTYT-FAUqBH8qpBZa-eF3rlgw'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x3')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Rinkeby', () => {
    it('Infura HTTP Endpoint: https://rinkeby.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://rinkeby.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-rinkeby.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn', async () => {
      const pro = provider(['https://eth-rinkeby.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-rinkeby.ws.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn', async () => {
      const pro = provider(['wss://eth-rinkeby.ws.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Görli', () => {
    it('Mudit HTTP Endpoint: https://rpc.goerli.mudit.blog', async () => {
      const pro = provider(['https://rpc.goerli.mudit.blog'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura HTTP Endpoint: https://goerli.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://goerli.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://goerli.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://goerli.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-goerli.alchemyapi.io/v2/U3oyFKY1jVpX2APDwMjbNOCIZlt8e6rg', async () => {
      const pro = provider(['https://eth-goerli.alchemyapi.io/v2/U3oyFKY1jVpX2APDwMjbNOCIZlt8e6rg'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-goerli.ws.alchemyapi.io/v2/U3oyFKY1jVpX2APDwMjbNOCIZlt8e6rg', async () => {
      const pro = provider(['wss://eth-goerli.ws.alchemyapi.io/v2/U3oyFKY1jVpX2APDwMjbNOCIZlt8e6rg'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Kovan', () => {
    it('Infura HTTP Endpoint: https://kovan.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://kovan.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://kovan.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://kovan.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-kovan.alchemyapi.io/v2/95cngtka6KasmW5lrKUX1xAGn8tu-RPZ', async () => {
      const pro = provider(['https://eth-kovan.alchemyapi.io/v2/95cngtka6KasmW5lrKUX1xAGn8tu-RPZ'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-kovan.ws.alchemyapi.io/v2/95cngtka6KasmW5lrKUX1xAGn8tu-RPZ', async () => {
      const pro = provider(['wss://eth-kovan.ws.alchemyapi.io/v2/95cngtka6KasmW5lrKUX1xAGn8tu-RPZ'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Gnosis', () => {
    it('Gnosis HTTP Endpoint: https://rpc.gnosischain.com ', async () => {
      const pro = provider(['https://rpc.gnosischain.com '])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x64')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Polygon', () => {
    it('Infura WS Endpoint: wss://polygon-mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://polygon-mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x89')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura HTTP Endpoint: https://polygon-mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://polygon-mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x89')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Arbitrum', () => {
    it('Infura WS Endpoint: wss://arbitrum-mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://arbitrum-mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xa4b1')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura HTTP Endpoint: https://arbitrum-mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://arbitrum-mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xa4b1')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Optimism', () => {
    it('Infura HTTP Endpoint: https://optimism-mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://optimism-mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xa')
      pro.close()
    }).timeout(45 * 1000)

    it('Optimism HTTP Endpoint: https://mainnet.optimism.io', async () => {
      const pro = provider(['https://mainnet.optimism.io'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xa')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Rinkeby', () => {
    it('Infura HTTP Endpoint: https://rinkeby.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://rinkeby.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-rinkeby.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn', async () => {
      const pro = provider(['https://eth-rinkeby.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-rinkeby.ws.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn', async () => {
      const pro = provider(['wss://eth-rinkeby.ws.alchemyapi.io/v2/S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Sepolia', () => {
    it('Infura HTTP Endpoint: https://sepolia.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['https://sepolia.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xaa36a7')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://sepolia.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', async () => {
      const pro = provider(['wss://sepolia.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xaa36a7')
      pro.close()
    }).timeout(45 * 1000)
  })

  testablePresets.forEach((name) => {
    it(`preset: ${name}`, async () => {
      const pro = provider(name, presetOpts)
      assert(await pro.request({ method: 'eth_chainId' }) === chainIdMap[name])
      pro.close()
    }).timeout(45 * 1000)
  })
})
