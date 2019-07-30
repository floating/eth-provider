<br>
<div align="center">
  <img src="/asset/header.png?raw=true" alt="eth-provider" height="400"/>
</div>
<br>
<br>
<h3 align="center">A Universal Ethereum Provider Client</h3>
<p align="center">Seamlessly connect to  <b>HTTP</b>, <b>WebSocket</b>, <b>IPC</b> and <b>Injected</b> RPC transports in <b>Node</b> and the <b>Browser</b>!</p>
<br>
<br>

### Notice
* Evolving with [EIP 1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md)
* Testing and feedback is very much appreciated!

### Goals
* Support all transport types
* Attempt connection to an array of RPC endpoints until success
* Reconnect when connection is lost
* Emit helpful status updates so apps can handle changes gracefully
* Implement `eth_pollSubscriptions` method for HTTP subscriptions (supported by [Frame](https://github.com/floating/frame))

### Install
```
npm install eth-provider --save
```

### Use
```js
const provider = require('eth-provider')
const web3 = new Web3(provider())
```
* By default, eth-provider will first try to discover providers injected by the environment, usually by a browser or extension
* If eth-provider fails to find an injected provider it will attempt to connect to local providers running on the user's device like [Frame](https://github.com/floating/frame), Geth or Parity
* You can override these defaults by passing in your own RPC targets
```js
const provider = require('eth-provider')
const web3 = new Web3(provider('wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b'))
```
* When passing in multiple RPC targets order them by priority
* When eth-provider fails to connect to a target it will automatically attempt to connect to the next priority target
* For example `['injected', 'wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b']` will first try to discover injected providers and if unsuccessful connect to the Infura endpoint
```js
const provider = require('eth-provider')
const web3 = new Web3(provider(['injected', 'wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b']))
```
* In Node and Electron you'll have access to IPC endpoints created by Geth or Parity that cannot be accessed by the Browser. You can connect to these by using the `'direct'` preset, or by passing custom IPC paths
```js
const provider = require('eth-provider')
const web3 = new Web3(provider('direct'))
```

### Presets
* **`injected`** - Discover providers injected by environment, usually by the browser or a browser extension
  * Browser
    * `['injected']`
* **`frame`** - Connect to [Frame](https://github.com/floating/frame) running on the user's device
  * Browser/Node/Electron
    * `['ws://127.0.0.1:1248', 'http://127.0.0.1:1248']`
* **`direct`** - Connect to local Ethereum nodes running on the user's device
  * Browser
    * `['ws://127.0.0.1:8546', 'http://127.0.0.1:8545']`
  * Node/Electron
    * `[/* Default IPC paths for platform */, 'ws://127.0.0.1:8546', 'http://127.0.0.1:8545']`
* **`infura`** - Connect to Mainnet Infura
  * Browser/Node/Electron
    * `['wss://mainnet.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b']`
* **`infuraRinkeby`** - Connect to Rinkeby Infura
  * Browser/Node/Electron
    * `['wss://rinkeby.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://rinkeby.infura.io/v3/786ade30f36244469480aa5c2bf0743b']`
* **`infuraRopsten`** - Connect to Ropsten Infura
  * Browser/Node/Electron
    * `['wss://ropsten.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://ropsten.infura.io/v3/786ade30f36244469480aa5c2bf0743b']`
* **`infuraKovan`** - Connect to Kovan Infura
  * Browser/Node/Electron
    * `['wss://kovan.infura.io/ws/v3/786ade30f36244469480aa5c2bf0743b', 'https://kovan.infura.io/v3/786ade30f36244469480aa5c2bf0743b']`

If you do not pass any targets, eth-provider will use default targets `['injected', 'frame']` in the Browser and `['frame', 'direct']` in Node and Electron.
