import Command from "felony/base/Command.js";

/**
 * Get the mnemonic
 *
 * @class
 */
export default class GetMnemonic extends Command {
  /**
   * Static signature key that will be callable name of our command.
   *
   * @type string
   */
  static signature = "get-mnemonic";

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
    let mnemonic = null;

    if (this.payload.account) {
      for (const account of Felony.config.keys) {
        if (account.name === this.payload.account) {
          mnemonic = account.mnemonic;
        }
      }
    }

    if (this.payload.mnemonic && !this.payload.account) {
      mnemonic = this.payload.mnemonic;
    }

    if (!mnemonic && !this.payload.mnemonic && !this.payload.account) {
      mnemonic = Felony.config.chain.wallet.MNEMONIC;
    }

    if (!mnemonic) {
      throw new Error(`No proper mnemonic found`);
    }

    if (this.cli) {
      console.log(`Mnemonic: '${mnemonic}'`);
    }

    return mnemonic;
  }
}
