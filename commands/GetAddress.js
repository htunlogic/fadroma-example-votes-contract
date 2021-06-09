import Command from "felony/base/Command.js";
import { promises as fs } from "fs";

/**
 * Get the contract address from lock file
 *
 * @class
 */
export default class GetAddress extends Command {
  /**
   * Static signature key that will be callable name of our command.
   *
   * @type string
   */
  static signature = "get-address";

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
    const lock = await fs.readFile(`${Felony.appRootPath}/.contract_lock`);

    return lock.toString();
  }
}
