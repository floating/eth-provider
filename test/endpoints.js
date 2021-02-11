/* globals it describe */

const assert = require('assert')
const provider = require('../')

describe('Test Endpoints', () => {
  describe('Mainnet (send)', () => {
    it('Cloudflare Endpoint: https://cloudflare-eth.com', async () => {
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
    it('Cloudflare Endpoint: https://cloudflare-eth.com', async () => {
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

    it('Alchemy HTTP Endpoint: https://eth-mainnet.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0', async () => {
      const pro = provider('https://eth-mainnet.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0')
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-mainnet.ws.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0', async () => {
      const pro = provider(['wss://eth-mainnet.ws.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy Preset Endpoints: \'alchemy\'', async () => {
      const pro = provider('alchemy', { alchemyId: 'NBms1eV9i16RFHpFqQxod56OLdlucIq0' })
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

    it('Alchemy HTTP Endpoint: https://eth-ropsten.alchemyapi.io/v2/309BFrQgBev-IEsRukKFKN-5j19HRUQk', async () => {
      const pro = provider(['https://eth-ropsten.alchemyapi.io/v2/309BFrQgBev-IEsRukKFKN-5j19HRUQk'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x3')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-ropsten.ws.alchemyapi.io/v2/309BFrQgBev-IEsRukKFKN-5j19HRUQk', async () => {
      const pro = provider(['wss://eth-ropsten.ws.alchemyapi.io/v2/309BFrQgBev-IEsRukKFKN-5j19HRUQk'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x3')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy Preset Endpoints: \'alchemyRopsten\'', async () => {
      const pro = provider('alchemyRopsten', { alchemyId: '309BFrQgBev-IEsRukKFKN-5j19HRUQk' })
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

    it('Alchemy HTTP Endpoint: https://eth-rinkeby.alchemyapi.io/v2/jQfxLzfySetDYKmplUgK1nm6vfNnhasr', async () => {
      const pro = provider(['https://eth-rinkeby.alchemyapi.io/v2/jQfxLzfySetDYKmplUgK1nm6vfNnhasr'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-rinkeby.ws.alchemyapi.io/v2/jQfxLzfySetDYKmplUgK1nm6vfNnhasr', async () => {
      const pro = provider(['wss://eth-rinkeby.ws.alchemyapi.io/v2/jQfxLzfySetDYKmplUgK1nm6vfNnhasr'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy Preset Endpoints: \'alchemyRinkeby\'', async () => {
      const pro = provider('alchemyRinkeby', { alchemyId: 'jQfxLzfySetDYKmplUgK1nm6vfNnhasr' })
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Görli', () => {
    it('Prylabs HTTP Endpoint: https://goerli.prylabs.net', async () => {
      const pro = provider(['https://goerli.prylabs.net'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Mudit HTTP Endpoint: https://rpc.goerli.mudit.blog', async () => {
      const pro = provider(['https://rpc.goerli.mudit.blog'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Slockit HTTP Endpoint: https://rpc.slock.it/goerli', async () => {
      const pro = provider(['https://rpc.slock.it/goerli'])
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

    it('Alchemy HTTP Endpoint: https://eth-goerli.alchemyapi.io/v2/kWQ7ItsHOI_HooADAfkHFNNueKbOsHxe', async () => {
      const pro = provider(['https://eth-goerli.alchemyapi.io/v2/kWQ7ItsHOI_HooADAfkHFNNueKbOsHxe'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-goerli.ws.alchemyapi.io/v2/kWQ7ItsHOI_HooADAfkHFNNueKbOsHxe', async () => {
      const pro = provider(['wss://eth-goerli.ws.alchemyapi.io/v2/kWQ7ItsHOI_HooADAfkHFNNueKbOsHxe'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x5')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy Preset Endpoints: \'alchemyGoerli\'', async () => {
      const pro = provider('alchemyGoerli', { alchemyId: 'kWQ7ItsHOI_HooADAfkHFNNueKbOsHxe' })
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

    it('Alchemy HTTP Endpoint: https://eth-kovan.alchemyapi.io/v2/QM2H65KBbywSoB0NOcDGreaDWwJqphfb', async () => {
      const pro = provider(['https://eth-kovan.alchemyapi.io/v2/QM2H65KBbywSoB0NOcDGreaDWwJqphfb'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-kovan.ws.alchemyapi.io/v2/QM2H65KBbywSoB0NOcDGreaDWwJqphfb', async () => {
      const pro = provider(['wss://eth-kovan.ws.alchemyapi.io/v2/QM2H65KBbywSoB0NOcDGreaDWwJqphfb'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy Preset Endpoints: \'alchemyKovan\'', async () => {
      const pro = provider('alchemyKovan', { alchemyId: 'QM2H65KBbywSoB0NOcDGreaDWwJqphfb' })
      assert(await pro.request({ method: 'eth_chainId' }) === '0x2a')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('IDChain', () => {
    it('Preset Endpoint: \'idChain\'', async () => {
      const pro = provider(['idChain'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x4a')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('xDai', () => {
    it('POA HTTP Endpoint: https://dai.poa.network', async () => {
      const pro = provider(['https://dai.poa.network'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x64')
      pro.close()
    }).timeout(45 * 1000)

    it('xDai Chain HTTP Endpoint: https://rpc.xdaichain.com', async () => {
      const pro = provider(['https://rpc.xdaichain.com'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x64')
      pro.close()
    }).timeout(45 * 1000)

    it('Preset Endpoint: \'xDai\'', async () => {
      const pro = provider(['xDai'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x64')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Matic', () => {
    it('Preset Endpoint: \'matic\'', async () => {
      const pro = provider(['matic'])
      assert(await pro.request({ method: 'eth_chainId' }) === '0x89')
      pro.close()
    }).timeout(45 * 1000)
  })
})
