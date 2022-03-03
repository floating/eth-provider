/* globals describe it */

const assert = require('assert')
const Web3 = require('web3')
const provider = require('../')

describe('Test web3 is v1.x', () => {
  it('major version should be 1', () => {
    assert(new Web3().version[0] === '1')
  })
})

const httpTestMap = [{
  protocolName: 'HTTP',
  url: 'http://127.0.0.1:1248'
}, {
  protocolName: 'HTTPS',
  url: 'https://127.0.0.1:1249'
}]

const websocketsTestMap = [{
  protocolName: 'ws',
  url: 'ws://127.0.0.1:1248'
}, {
  protocolName: 'wss',
  url: 'wss://127.0.0.1:1249'
}]

httpTestMap.forEach(({ protocolName, url }) => {
  describe(`${protocolName} Provider (Frame)`, () => {
    const httpProvider = provider(url, { origin: `${protocolName}ProviderOriginTest` })
    const web3http = new Web3(httpProvider)
    describe(`Subscribe via ${protocolName} (please wait for two blocks)`, () => {
      it('should subscribe to newBlockHeaders', done => {
        const sub = web3http.eth.subscribe('newBlockHeaders', (err, result) => {
          if (err) throw err
          assert(result)
          sub.unsubscribe((err, success) => {
            if (err) throw err
            assert(success)
            done()
          })
        })
      }).timeout(45 * 1000)
      it(`should subscribe to newBlockHeaders via ${protocolName} using EIP-1193 spec`, done => {
        const waitForNewHead = async () => {
          try {
            const subId = await httpProvider.request({ method: 'eth_subscribe', params: ['newHeads'] })
            const onMessage = message => {
              if (message.type === 'eth_subscription') {
                const { data } = message
                if (data.subscription === subId) {
                  if ('result' in data && typeof data.result === 'object') {
                    assert(typeof data.result === 'object')
                    httpProvider.off('message', onMessage)
                    done()
                  } else {
                    throw new Error(`Something went wrong: ${data.result}`)
                  }
                }
              }
            }
            httpProvider.on('message', onMessage)
          } catch (e) {
            console.error(e)
          }
        }
        waitForNewHead()
      }).timeout(45 * 1000)
    })
    describe(`Get accounts via ${protocolName}`, () => {
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
})

websocketsTestMap.forEach(({ protocolName, url }) => {
  describe('WebSocket Provider', () => {
    const wsProvider = provider(url, protocolName === 'WSS' ? { rejectUnauthorized: false } : {})
    const web3ws = new Web3(wsProvider)
    describe(`Subscribe via ${protocolName} (please wait for next block)`, () => {
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
      }).timeout(45 * 1000)
    })
    describe(`Get accounts via ${protocolName}`, () => {
      it('should return array', done => {
        web3ws.eth.getAccounts().then(accounts => {
          assert(Array.isArray(accounts))
          done()
        }).catch(err => { throw err })
      }).timeout(45 * 1000)
      it('should close itself', done => {
        web3ws.eth.getAccounts().then(accounts => {
          assert(Array.isArray(accounts))
          wsProvider.once('close', done)
          wsProvider.close()
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

  describe('Frame Quit Connect/Disconnect Events', () => {
    const wsProvider = provider(url)
    describe('Should handle connections on quit and launch', () => {
      it('should disconnect on quit', done => {
        console.log('Please close Frame')
        wsProvider.once('disconnect', () => done())
      }).timeout(45 * 1000)
      it('should connect on launch', done => {
        console.log('Please launch Frame')
        wsProvider.once('connect', () => {
          done()
          wsProvider.close()
        })
      }).timeout(45 * 1000)
    })
  })
})
