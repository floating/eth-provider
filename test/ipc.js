/* globals describe it */

const assert = require('assert')
const Web3 = require('web3')
const provider = require('../')

describe('IPC Provider', () => {
  const ipcProvider = provider('direct')
  const web3ipc = new Web3(ipcProvider)
  describe('Subscribe via IPC (please wait for next block)', () => {
    it('should subscribe to newBlockHeaders', done => {
      const sub = web3ipc.eth.subscribe('newBlockHeaders', (err, result) => {
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
  describe('Get accounts via IPC', () => {
    it('should return array', done => {
      web3ipc.eth.getAccounts().then(accounts => {
        assert(Array.isArray(accounts))
        ipcProvider.close()
        done()
      }).catch(err => { throw err })
    }).timeout(45 * 1000)
    it('should error due to being closed', done => {
      web3ipc.eth.getAccounts().then().catch(err => {
        assert(err.message === 'Not connected')
        done()
      })
    }).timeout(45 * 1000)
  })
})
