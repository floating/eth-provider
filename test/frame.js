/* globals describe it */

const assert = require('assert')
const Web3 = require('web3')
const provider = require('../')

describe('HTTP Provider (Frame)', () => {
  let httpProvider = provider('http://127.0.0.1:1248')
  let web3http = new Web3(httpProvider)
  describe('Subscribe via HTTP (please wait for next block)', () => {
    it('should subscribe to newBlockHeaders', done => {
      let sub = web3http.eth.subscribe('newBlockHeaders', (err, result) => {
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
    })
    it('should error due to being closed', done => {
      web3http.eth.getAccounts().then().catch(err => {
        assert(err.message === 'Not connected')
        done()
      })
    })
  })
})

describe('WebSocket Provider', () => {
  let wsProvider = provider('http://127.0.0.1:1248')
  let web3ws = new Web3(wsProvider)
  describe('Subscribe via WS (please wait for next block)', () => {
    it('should subscribe to newBlockHeaders', done => {
      let sub = web3ws.eth.subscribe('newBlockHeaders', (err, result) => {
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
  describe('Get accounts via WS', () => {
    it('should return array', done => {
      web3ws.eth.getAccounts().then(accounts => {
        assert(Array.isArray(accounts))
        wsProvider.close()
        done()
      }).catch(err => { throw err })
    })
    it('should error due to being closed', done => {
      web3ws.eth.getAccounts().then().catch(err => {
        assert(err.message === 'Not connected')
        done()
      })
    })
  })
})
