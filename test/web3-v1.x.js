/* globals describe it */

const assert = require('assert')
const Web3 = require('web3')
const provider = require('../')
const getPresets = require('../presets')

const presetOpts = { infuraId: '786ade30f36244469480aa5c2bf0743b', alchemyId: 'NBms1eV9i16RFHpFqQxod56OLdlucIq0' }
const presets = Object.keys(getPresets(presetOpts)).filter((name) => !['injected', 'frame', 'direct'].includes(name))
const netIdMap = {
  infura: 1,
  alchemy: 1,
  infuraGoerli: 5,
  alchemyGoerli: 5,
  infuraPolygon: 137,
  infuraArbitrum: 42161,
  infuraOptimism: 10,
  infuraSepolia: 11155111,
  gnosis: 100,
  optimism: 10
}

describe('Test web3 is v1.x', () => {
  it('major version should be 1', () => {
    assert(new Web3().version[0] === '1')
  }).timeout(45 * 1000)
})

describe('WebSocket Provider', () => {
  const wsProvider = provider('wss://sepolia.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b')
  const web3ws = new Web3(wsProvider)
  // v1.x specific
  describe('Subscribe via WS (please wait for next block)', () => {
    it('should subscribe to newBlockHeaders', done => {
      const sub = web3ws.eth.subscribe('newBlockHeaders', (err, result) => {
        if (err) throw err
        assert(result)
        sub.unsubscribe((err, success) => {
          if (err) throw err
          assert(success)
          done()
        })
      })
    }).timeout(25 * 1000)
  })
  describe('Get accounts via WS', () => {
    it('should return array', done => {
      web3ws.eth.getAccounts().then(accounts => {
        assert(Array.isArray(accounts))
        wsProvider.close()
        done()
      }).catch(err => { throw err })
    }).timeout(45 * 1000)
    it('should error due to being closed', done => {
      web3ws.eth.getAccounts().then().catch(err => {
        assert(err.message === 'Not connected')
        done()
      })
    }).timeout(45 * 1000)
  })
})
describe('HTTP Provider', () => {
  const httpProvider = provider('https://sepolia.infura.io/v3/786ade30f36244469480aa5c2bf0743b')
  const web3http = new Web3(httpProvider)
  // v1.x specific
  describe('Subscribe via HTTP', () => {
    it('should be unsupported', done => {
      web3http.eth.subscribe('newBlockHeaders', (err, result) => {
        assert(err.message === 'Subscriptions are not supported by this HTTP endpoint')
        done()
      })
    }).timeout(45 * 1000)
  })
  describe('Get accounts via HTTP', () => {
    it('should return array', done => {
      web3http.eth.getAccounts().then(accounts => {
        assert(Array.isArray(accounts))
        httpProvider.close()
        done()
      }).catch(err => {
        console.log(err)
        throw err
      })
    }).timeout(45 * 1000)
    it('should error due to being closed', done => {
      web3http.eth.getAccounts().then().catch(err => {
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
      web3.eth.net.getId((err, netId) => {
        if (err) throw err
        assert(netId === netIdMap[name])
        p.close()
        done()
      })
    }).timeout(45 * 1000)
  })
})
