import Command from "felony/base/Command.js";

import {
  EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey
} from "secretjs";

/**
 * Get client for interacting with the contract
 *
 * @class
 */
export default class GetClient extends Command {
  /**
   * Static signature key that will be callable name of our command.
   *
   * @type string
   */
  static signature = "get-client";

  /**
   * User friendly description of the command that has to be static.
   *
   * @type string
   */
  static description = "";

  /**
   * User friendly example of your command usage.
   *
   * @type string
   */
  static usage = "";

  /**
   * Handler method of the command that will run the action.
   *
   * @return {Promise<any>}
   */
  async handle() {
    const signingPen = await this.getSigningPen();

    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

    const address = await this.getAccountAddress();
    
    const client = new SigningCosmWasmClient(
      Felony.config.chain.SECRET_REST_URL,
      address,
      (signingBytes) => signingPen.sign(signingBytes),
      txEncryptionSeed,
      Felony.config.contract.fees,
    );

    if (this.cli) {
      return console.log("Got mnemonic, please don't call this command directly.");
    }

    return client;
  }

  /**
   * Returns a signing pen from mnemonic string
   * 
   * @returns object
   */
  async getSigningPen() {
    return await Secp256k1Pen.fromMnemonic(await Felony.kernel.console.run("get-mnemonic", this.payload));
  }

  /**
   * Returns the pubkey
   * 
   * @returns array
   */
  async getPubkey() {
    return encodeSecp256k1Pubkey((await this.getSigningPen()).pubkey);
  }

  /**
   * Generate account address
   * 
   * @returns string
   */
  async getAccountAddress() {
    return pubkeyToAddress(await this.getPubkey(), "secret");
  }
}
