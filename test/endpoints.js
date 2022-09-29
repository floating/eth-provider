/* globals it describe */
const assert = require('assert')
const provider = require('../')
const getPresets = require('../presets')

const presetOpts = { infuraId: '786ade30f36244469480aa5c2bf0743b', alchemyId: 'NBms1eV9i16RFHpFqQxod56OLdlucIq0' }
const presets = getPresets(presetOpts)
const totalEndpoints = Object.entries(presets).filter(([name]) => !['injected', 'frame', 'direct'].includes(name))
const mainnetEndpoints = totalEndpoints.filter(([name]) => ['infura', 'alchemy'].includes(name))
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
  mainnetEndpoints.forEach(([name, endpoints]) => {
    endpoints.forEach((uri) => {
      it(`endpoint: ${uri}`, async () => {
        const pro = provider([uri])
        assert(await pro.send('net_version') === '1')
        pro.close()
      }).timeout(45 * 1000)
    })

    it(`preset: ${name}`, async () => {
      const pro = provider(name, presetOpts)
      assert(await pro.send('net_version') === '1')
      pro.close()
    }).timeout(45 * 1000)
  })
})

describe('All endpoints - requesting eth_chainId', () => {
  totalEndpoints.forEach(([name, endpoints]) => {
    endpoints.forEach((uri) => {
      it(`endpoint: ${uri}`, async () => {
        const pro = provider([uri])
        assert(await pro.request({ method: 'eth_chainId' }) === chainIdMap[name])
        pro.close()
      }).timeout(45 * 1000)
    })

    it(`preset: ${name}`, async () => {
      const pro = provider(name, presetOpts)
      assert(await pro.request({ method: 'eth_chainId' }) === chainIdMap[name])
      pro.close()
    }).timeout(45 * 1000)
  })
})
