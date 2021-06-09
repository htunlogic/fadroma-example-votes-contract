import Listener from "felony/base/Listener.js";
import { app as Felony } from "felony";
import { config as dotenvConfig } from "dotenv";
import { promises as fs } from "fs";

/**
 * Event listener that will trigger on the events you add in listen array
 *
 * @class
 */
export default class InitListener extends Listener {
  /**
   * List of event constructor names that this listener will be triggered for
   *
   * @type {string[]}
   */
  static listen = ["FelonyGotConfiguration"];

  /**
   * Handler that will trigger after the event was raised, event will be available under this.event: Event
   *
   * @return {Promise<void>}
   */
  async handle() {
    dotenvConfig();

    this.handleEnvVariable("SECRET_REST_URL");
    this.handleEnvVariable("SECRET_RPC_URL");
    this.handleEnvVariable("SECRET_WS_URL");
    this.handleEnvVariable("SECRET_CHAIN_ID");

    await this.handleWallet();
  }

  /**
   * Rewrite the local variables from .env
   * 
   * @param {string} variable 
   * @param {string} location 
   */
  handleEnvVariable(variable) {
    if (process.env[variable]) {
      Felony.config.chain[variable] = process.env[variable];
    }
  }

  /**
   * Set the main wallet to use from existing config or from .env
   */
  async handleWallet() {
    const accounts = await this.getAccounts();
    Felony.config.keys = accounts;
    
    if (process.env.MNEMONIC && process.env.ADDRESS) {
      Felony.config.chain.wallet = {
        MNEMONIC: process.env.MNEMONIC,
        ADDRESS: process.env.ADDRESS,
      };
    }
    else {
      Felony.config.chain.wallet = {
        MNEMONIC: Felony.config.keys[0].mnemonic,
        ADDRESS: Felony.config.keys[0].address,
      };
    }
  }

  /**
   * Load accounts from json
   * 
   * @returns Buffer
   */
  async getAccounts() {
    const location = `${Felony.appRootPath}/accounts.json`;

    try {
      const isFile = (await fs.stat(location)).isFile();

      if (!isFile) {
        throw new Error(`Accounts not found at '${location}'`);
      }

      const file = await fs.readFile(location);
      
      return JSON.parse(file.toString());
    }
    catch (e) {
      console.error(e);
      throw new Error(`Accounts not found at '${location}' or invalid JSON`);
    }
  }
}
