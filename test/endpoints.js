/* globals it describe */
const assert = require('assert')
const provider = require('../')
const getPresets = require('../presets')

const presetOpts = {
  infuraId: '76cced0cada04535b47c5605d12989ea',
  alchemyId: 'NBms1eV9i16RFHpFqQxod56OLdlucIq0'
}
const presets = getPresets(presetOpts)
const testablePresets = Object.keys(presets).filter((name) => !['injected', 'frame', 'direct'].includes(name))
const mainnetPresets = ['infura', 'alchemy']
const chainIdMap = {
  infura: '0x1',
  alchemy: '0x1',
  infuraPolygon: '0x89',
  infuraArbitrum: '0xa4b1',
  infuraOptimism: '0xa',
  infuraSepolia: '0xaa36a7',
  gnosis: '0x64',
  optimism: '0xa'
}

describe('Mainnet - sending net_version', () => {
  it('Infura HTTP Endpoint: https://mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea', async () => {
    const pro = provider(['https://mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea'])
    assert((await pro.send('net_version')) === '1')
    pro.close()
  }).timeout(45 * 1000)

  it('Infura WS Endpoint: wss://mainnet.infura.io/ws/v3/76cced0cada04535b47c5605d12989ea', async () => {
    const pro = provider(['wss://mainnet.infura.io/ws/v3/76cced0cada04535b47c5605d12989ea'])
    assert((await pro.send('net_version')) === '1')
    pro.close()
  }).timeout(45 * 1000)

  it('Alchemy HTTP Endpoint: https://eth-mainnet.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0', async () => {
    const pro = provider(['https://eth-mainnet.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0'])
    assert((await pro.send('net_version')) === '1')
    pro.close()
  }).timeout(45 * 1000)

  it('Alchemy WS Endpoint: wss://eth-mainnet.ws.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0', async () => {
    const pro = provider(['wss://eth-mainnet.ws.alchemyapi.io/v2/NBms1eV9i16RFHpFqQxod56OLdlucIq0'])
    assert((await pro.send('net_version')) === '1')
    pro.close()
  }).timeout(45 * 1000)

  mainnetPresets.forEach((name) => {
    it(`preset: ${name}`, async () => {
      const pro = provider(name, presetOpts)
      assert((await pro.send('net_version')) === '1')
      pro.close()
    }).timeout(45 * 1000)
  })
})

describe('All endpoints - requesting eth_chainId', () => {
  describe('Mainnet', () => {
    it('Infura HTTP Endpoint: https://mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider(['https://mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://mainnet.infura.io/ws/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider('wss://mainnet.infura.io/ws/v3/76cced0cada04535b47c5605d12989ea')
      assert((await pro.request({ method: 'eth_chainId' })) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy HTTP Endpoint: https://eth-mainnet.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5', async () => {
      const pro = provider('https://eth-mainnet.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5')
      assert((await pro.request({ method: 'eth_chainId' })) === '0x1')
      pro.close()
    }).timeout(45 * 1000)

    it('Alchemy WS Endpoint: wss://eth-mainnet.ws.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5', async () => {
      const pro = provider(['wss://eth-mainnet.ws.alchemyapi.io/v2/jn3PI8En2phQwdeFAaQ6LK2aexudYJs5'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0x1')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Gnosis', () => {
    it('Gnosis HTTP Endpoint: https://rpc.gnosischain.com ', async () => {
      const pro = provider(['https://rpc.gnosischain.com '])
      assert((await pro.request({ method: 'eth_chainId' })) === '0x64')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Polygon', () => {
    it('Infura HTTP Endpoint: https://polygon-mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider(['https://polygon-mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0x89')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Arbitrum', () => {
    it('Infura HTTP Endpoint: https://arbitrum-mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider(['https://arbitrum-mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0xa4b1')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Optimism', () => {
    it('Infura HTTP Endpoint: https://optimism-mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider(['https://optimism-mainnet.infura.io/v3/76cced0cada04535b47c5605d12989ea'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0xa')
      pro.close()
    }).timeout(45 * 1000)

    it('Optimism HTTP Endpoint: https://mainnet.optimism.io', async () => {
      const pro = provider(['https://mainnet.optimism.io'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0xa')
      pro.close()
    }).timeout(45 * 1000)
  })

  describe('Sepolia', () => {
    it('Infura HTTP Endpoint: https://sepolia.infura.io/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider(['https://sepolia.infura.io/v3/76cced0cada04535b47c5605d12989ea'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0xaa36a7')
      pro.close()
    }).timeout(45 * 1000)

    it('Infura WS Endpoint: wss://sepolia.infura.io/ws/v3/76cced0cada04535b47c5605d12989ea', async () => {
      const pro = provider(['wss://sepolia.infura.io/ws/v3/76cced0cada04535b47c5605d12989ea'])
      assert((await pro.request({ method: 'eth_chainId' })) === '0xaa36a7')
      pro.close()
    }).timeout(45 * 1000)
  })

  testablePresets.forEach((name) => {
    it(`preset: ${name}`, async () => {
      const pro = provider(name, presetOpts)
      assert((await pro.request({ method: 'eth_chainId' })) === chainIdMap[name])
      pro.close()
    }).timeout(45 * 1000)
  })
})
