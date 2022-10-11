/* globals describe it */

const assert = require('assert')
const Web3 = require('web3')
const provider = require('../')
const getPresets = require('../presets')

const presetOpts = { infuraId: '786ade30f36244469480aa5c2bf0743b', alchemyId: 'NBms1eV9i16RFHpFqQxod56OLdlucIq0' }
const presets = Object.keys(getPresets(presetOpts)).filter((name) => !['injected', 'frame', 'direct'].includes(name))
const netIdMap = {
  infura: '1',
  alchemy: '1',
  infuraGoerli: '5',
  alchemyGoerli: '5',
  infuraPolygon: '137',
  infuraArbitrum: '42161',
  infuraOptimism: '10',
  infuraSepolia: '11155111',
  gnosis: '100',
  optimism: '10'
}

describe('Test web3 is v0.x', () => {
  it('major version should be 0', () => {
    assert(new Web3().version.api[0] === '0')
  }).timeout(45 * 1000)
})

describe('WebSocket Provider', () => {
  const wsProvider = provider('wss://sepolia.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b')
  const web3ws = new Web3(wsProvider)
  describe('Get accounts via WS', () => {
    it('should return array', done => {
      web3ws.eth.getAccounts((err, accounts) => {
        if (err) throw err
        assert(Array.isArray(accounts))
        wsProvider.close()
        done()
      })
    }).timeout(45 * 1000)
    it('should error due to being closed', done => {
      web3ws.eth.getAccounts(err => {
        assert(err.message === 'Not connected')
        done()
      })
    }).timeout(45 * 1000)
  })
})
describe('HTTP Provider', () => {
  const httpProvider = provider('https://sepolia.infura.io/v3/786ade30f36244469480aa5c2bf0743b')
  const web3http = new Web3(httpProvider)
  // v0.x specific
  describe('Batch requests', () => {
    it('process batch requests', done => {
      let count = 0
      const batch = web3http.createBatch()
      batch.add(web3http.eth.getAccounts.request((err, accounts) => {
        if (err) throw err
        assert(Array.isArray(accounts))
        if (++count >= 3) done()
      }))
      batch.add(web3http.eth.getAccounts.request((err, accounts) => {
        if (err) throw err
        assert(Array.isArray(accounts))
        if (++count >= 3) done()
      }))
      batch.add(web3http.eth.getAccounts.request((err, accounts) => {
        if (err) throw err
        assert(Array.isArray(accounts))
        if (++count >= 3) done()
      }))
      batch.execute()
    }).timeout(45 * 1000)
  })
  describe('Get accounts via HTTP', () => {
    it('should return array', done => {
      web3http.eth.getAccounts((err, accounts) => {
        if (err) throw err
        assert(Array.isArray(accounts))
        httpProvider.close()
        done()
      })
    }).timeout(45 * 1000)
    it('should error due to being closed', done => {
      web3http.eth.getAccounts(err => {
        assert(err.message === 'Not connected')
        done()
      })
    }).timeout(45 * 1000)
  })
})

describe('Presets', () => {
  presets.forEach((name) => {
    it(`${name} - net_version`, done => {
      const p = provider(name, presetOpts)
      const web3 = new Web3(p)
      web3.version.getNetwork((err, netId) => {
        if (err) throw err
        assert(netId === netIdMap[name])
        p.close()
        done()
      })
    }).timeout(45 * 1000)
  })
})
