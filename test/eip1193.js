/* globals describe it */

const assert = require('assert')
const provider = require('../')
const ethereum = provider(['frame'], { infuraId: '786ade30f36244469480aa5c2bf0743b', origin: 'EIP1193Tests' })

describe('EIP-1193 Tests', () => {
  it('should return a chainId', async () => {
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    assert(chainId)
  })

  it('should return accounts', async () => {
    console.log('If you\'re not logged into an account on frame please do so now')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    assert(accounts)
  })

  it('should return accounts (again)', async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    assert(accounts)
  }).timeout(45 * 1000)

  it('should pass on accountChance', done => {
    ethereum.once('accountsChanged', accounts => {
      assert(Array.isArray(accounts))
      done()
    })
    console.log('Please switch accounts in Frame...')
  }).timeout(45 * 1000)

  it('should pass on chainChange', done => {
    ethereum.once('chainChanged', netId => {
      assert(netId)
      done()
    })
    console.log('Please switch chains in Frame...')
  }).timeout(45 * 1000)

  it('should pass on networkChange', done => {
    setTimeout(() => {
      ethereum.once('networkChanged', netId => {
        assert(netId)
        ethereum.close()
        done()
      })
      console.log('Please switch chains in Frame (again)...')
    }, 1500)
  }).timeout(45 * 1000)
})
