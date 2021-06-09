import Command from "felony/base/Command.js";

/**
 * Query the contract for its status
 *
 * @class
 */
export default class GetStatus extends Command {
  /**
   * Static signature key that will be callable name of our command.
   *
   * @type string
   */
  static signature = "get-status";

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
    const address = await Felony.kernel.console.run("get-address", {});
    const client = await Felony.kernel.console.run("get-client", this.payload);

    const status = await client.queryContractSmart(address, { "status": {} });

    if (this.cli) {
      console.log(`Contract status: ${JSON.stringify(status, null, 2)}`);
    }

    return status;
  }
}
