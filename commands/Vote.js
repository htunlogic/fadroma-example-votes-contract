import Command from "felony/base/Command.js";

/**
 * Call the vote method on the deployed contract
 *
 * @class
 */
export default class Vote extends Command {
  /**
   * Static signature key that will be callable name of our command.
   *
   * @type string
   */
  static signature = "vote";

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
    const contractAddress = await Felony.kernel.console.run("get-address", {});
    const client = await Felony.kernel.console.run("get-client", this.payload);

    await client.execute(contractAddress, { vote: { option: this.payload.option || "n/a" } });
    
    const status = await Felony.kernel.console.run("get-status", this.payload);

    console.log(`Voted successfully, status after vote: ${JSON.stringify(status, null, 2)}`);
  }
}
