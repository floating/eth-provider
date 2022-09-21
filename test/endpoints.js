/* globals it describe */

const assert = require('assert')
const provider = require('../')

describe('Test Endpoints', () => {
  describe('Mainnet (send)', () => {
    it.skip('Cloudflare Endpoint: https://cloudflare-eth.com', async () => {
      const pro = provider(['https://cloudflare-eth.com'])
      assert(await pro.send('net_version') === '1')
      pro.close()
    }).timeout(45 * 1000)

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

    it('Infura Preset Endpoints: \'infura\'', async () => {
      const pro = provider('infura', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
      assert(await pro.send('net_version') === '1')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Mainnet', () => {
    it.skip('Cloudflare Endpoint: https://cloudflare-eth.com', async () => {
      const pro = provider(['https://cloudflare-eth.com'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

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

    it('Infura Preset Endpoints: \'infura\'', async () => {
      const pro = provider('infura', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Alchemy Preset Endpoints: \'alchemy\'', async () => {
      const pro = provider('alchemy', { alchemyId: 'jn3PI8En2phQwdeFAaQ6LK2aexudYJs5' })
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

    it('Infura Preset Endpoints: \'infuraRopsten\'', async () => {
      const pro = provider('infuraRopsten', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Alchemy Preset Endpoints: \'alchemyRopsten\'', async () => {
      const pro = provider('alchemyRopsten', { alchemyId: 'tgVXaG0xTYT-FAUqBH8qpBZa-eF3rlgw' })
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

    it('Infura Preset Endpoints: \'infuraRinkeby\'', async () => {
      const pro = provider('infuraRinkeby', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Alchemy Preset Endpoints: \'alchemyRinkeby\'', async () => {
      const pro = provider('alchemyRinkeby', { alchemyId: 'S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn' })
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

    it('Infura Preset Endpoints: \'infuraGoerli\'', async () => {
      const pro = provider('infuraGoerli', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Alchemy Preset Endpoints: \'alchemyGoerli\'', async () => {
      const pro = provider('alchemyGoerli', { alchemyId: 'U3oyFKY1jVpX2APDwMjbNOCIZlt8e6rg' })
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

    it('Infura Preset Endpoints: \'infuraKovan\'', async () => {
      const pro = provider('infuraKovan', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Alchemy Preset Endpoints: \'alchemyKovan\'', async () => {
      const pro = provider('alchemyKovan', { alchemyId: '95cngtka6KasmW5lrKUX1xAGn8tu-RPZ' })
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Gnosis', () => {
    it('Gnosis RPC Endpoint: https://rpc.gnosischain.com ', async () => {
      const pro = provider(['https://rpc.gnosischain.com '])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x64')
      pro.close()
    }).timeout(45 * 1000)

    it('Preset Endpoint: \'gnosis\'', async () => {
      const pro = provider(['gnosis'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x64')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Polygon', () => {
    it('Preset Endpoint: \'infuraPolygon\'', async () => {
      const pro = provider(['infuraPolygon'], { infuraId: '786ade30f36244469480aa5c2bf0743b' })
      assert(await pro.request({ method: 'eth_chainId' }) === '0x89')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Arbitrum', () => {
    it('Preset Endpoint: \'infuraArbitrum\'', async () => {
      const pro = provider(['infuraArbitrum'], { infuraId: '786ade30f36244469480aa5c2bf0743b' })
      assert(await pro.request({ method: 'eth_chainId' }) === '0xa4b1')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Optimism', () => {
    it('Preset Endpoint: \'optimism\'', async () => {
      const pro = provider(['optimism'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0xa')
      pro.close()
    }).timeout(45 * 1000)
    it('Preset Endpoint: \'infuraOptimism\'', async () => {
      const pro = provider(['infuraOptimism'], { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Infura Preset Endpoints: \'infuraRinkeby\'', async () => {
      const pro = provider('infuraRinkeby', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
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

    it('Alchemy Preset Endpoints: \'alchemyRinkeby\'', async () => {
      const pro = provider('alchemyRinkeby', { alchemyId: 'S0qILA0tYj3fRgZM9p6fUKx1uC5cDNwn' })
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

    it('Infura Preset Endpoints: \'infuraSepolia\'', async () => {
      const pro = provider('infuraSepolia', { infuraId: '786ade30f36244469480aa5c2bf0743b' })
      assert(await pro.request({ method: 'eth_chainId' }) === '0xaa36a7')
      pro.close()
    }).timeout(45 * 1000)
  })
})
