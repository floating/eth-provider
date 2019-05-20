const EventEmitter = require("events");
const WC = require("@walletconnect/browser");
const WCQRCode = require("@walletconnect/qrcode-modal");
const dev = process.env.NODE_ENV === "development";

let WalletConnect;

class WalletConnectConnection extends EventEmitter {
  constructor(_WalletConnect, url, options) {
    super();

    this.qrcode =
      typeof options.qrcode === "undefined" || options.qrcode !== false;

    WalletConnect = _WalletConnect || WC;

    setTimeout(() => this.create(url, options), 0);
  }

  create(url, options) {
    try {
      this.wc = new WalletConnect({ bridge: url });
    } catch (e) {
      return this.emit("error", e);
    }

    if (!this.wc.connected) {
      // create new session
      this.wc
        .createSession()
        .then(() => {
          if (this.qrcode) {
            WCQRCode.open(this.wc.uri, () =>
              this.emit(
                "error",
                new Error("User close WalletConnect QR Code modal")
              )
            );
          }
        })
        .catch(e => this.emit("error", e));
    }

    walletConnector.on("connect", (e, payload) => {
      if (e) {
        this.emit("error", e);
      }
      if (this.qrcode) {
        // close QR Code Modal
        WCQRCode.close();
      }

      // get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];

      // save accounts and chainId
      this.accounts = accounts;
      this.chainId = chainId;

      // emit connect event
      this.emit("connect");
    });

    walletConnector.on("session_update", (e, payload) => {
      if (e) {
        this.emit("error", e);
      }

      // get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];

      // check if accounts changed and trigger event
      if (this.accounts !== accounts) {
        this.accounts = accounts;
        this.emit("accountsChanged", accounts);
      }

      // check if chainId changed and trigger event
      if (this.chainId !== chainId) {
        this.chainId = chainId;
        this.emit("networkChanged", chainId);
      }
    });

    walletConnector.on("disconnect", (e, payload) => {
      if (e) {
        this.emit("error", e);
      }

      this.onClose();
    });
  }

  onClose() {
    this.wc = null;
    this.closed = true;
    if (dev) console.log("Closing WalletConnector connection");
    this.emit("close");
    this.removeAllListeners();
  }

  close() {
    if (this.wc) {
      this.wc.killSession();
    } else {
      this.onClose();
    }
  }

  error(payload, message, code = -1) {
    this.emit("payload", {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      error: { message, code }
    });
  }

  send(payload) {
    if (this.wc && this.wc.connected) {
      return this.wc.sendCustomRequest(payload);
    } else {
      return this.error(payload, "Not connected");
    }
  }
}

module.exports = _WalletConnect => (url, cb) =>
  new WalletConnectConnection(_WalletConnect, url, cb);
