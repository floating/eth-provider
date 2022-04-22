/* globals describe it */

const assert = require('assert')
const provider = require('../')
const ethereum = provider(['frame'], { infuraId: '786ade30f36244469480aa5c2bf0743b', origin: 'EIP1193Tests' })

describe('EIP-1193 Tests', () => {
  it('should return a chainId', async () => {
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    assert(chainId)
  }).timeout(45 * 1000)

  it('should still work via eip .send', async () => {
    const chainId = await ethereum.send('eth_chainId')
    assert(chainId)
  }).timeout(45 * 1000)

  it('should still work via legacy .send', async () => {
    const chainId = await ethereum.send({ method: 'eth_chainId' })
    assert(chainId)
  }).timeout(45 * 1000)

  it('should still work via eip .sendAsync', async () => {
    ethereum.sendAsync({ method: 'eth_chainId' }, (err, res) => {
      if (err) throw err
      const chainId = res.result
      assert(chainId)
    })
  }).timeout(45 * 1000)

  it('wait for available account', done => {
    const accountCheck = async () => {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length) return done()
      } catch (e) {
        if (e.code === 4001) {
          console.log('Waiting for an account to be available...')
          const accountsChange = a => {
            ethereum.off('accountsChanged', accountsChange)
            console.log('Account found!')
            if (a.length) return done()
          }
          ethereum.on('accountsChanged', accountsChange)
        }
      }
    }
    accountCheck()
  }).timeout(45 * 1000)

  it('should return accounts', async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    assert(accounts.length)
  }).timeout(45 * 1000)

  it('should return accounts (again)', async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    assert(accounts.length)
  }).timeout(45 * 1000)

  it('should get accountsChanged event', done => {
    console.log('Change your Frame account')
    const accountsChanged = accounts => {
      assert(Array.isArray(accounts))
      ethereum.off('accountsChanged', accountsChanged)
      done()
    }
    ethereum.on('accountsChanged', accountsChanged)
  }).timeout(45 * 1000)

  it('should subscribe to newBlockHeaders using EIP-1193 spec', done => {
    const waitForNewHead = async () => {
      try {
        const subId = await ethereum.request({ method: 'eth_subscribe', params: ['newHeads'] })
        const onMessage = message => {
          if (message.type === 'eth_subscription') {
            const { data } = message
            if (data.subscription === subId) {
              if ('result' in data && typeof data.result === 'object') {
                assert(typeof data.result === 'object')
                ethereum.off('message', onMessage)
                done()
              } else {
                throw new Error(`Something went wrong: ${data.result}`)
              }
            }
          }
        }
        ethereum.on('message', onMessage)
      } catch (e) {
        console.error(e)
      }
    }
    console.log('Testing newHeads subscription, please wait...')
    waitForNewHead()
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
