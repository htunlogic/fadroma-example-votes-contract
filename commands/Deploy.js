import Command from "felony/base/Command.js";
import { promises as fs } from "fs";
import { app as Felony } from "felony";
import path from "path";
import zlib from "zlib";

/**
 * Command to deploy the contract
 *
 * @class
 */
export default class Deploy extends Command {
  /**
   * Static signature key that will be callable name of our command.
   *
   * @type string
   */
  static signature = "deploy";

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
    const options = this.getOptions();
    const mnemonic = Felony.kernel.console.run("get-mnemonic", this.payload);
    
    const client = await Felony.kernel.console.run("get-client", {
      mnemonic,
    });

    console.log("Uploading contract...");
    const response = await client.upload(await this.getContract(), {});

    console.log(`Code ID: ${response.codeId}`);

    const hash = await client.restClient.getCodeHashByCodeId(response.codeId);
    console.log(`Contract hash: ${hash}`);

    const contract = await client.instantiate(
      response.codeId,
      { options },
      "votes-" + Math.ceil(Math.random() * 10000)
    );

    console.log(`Contract: ${JSON.stringify(contract, null, 2)}`);

    const contractAddress = contract.contractAddress;

    await this.createLockFile(contractAddress);

    const status = await Felony.kernel.console.run("get-status", this.payload);

    console.log(`Contract init state: ${JSON.stringify(status, null, 2)}`);
  }

  /**
   * Get contract wasm binary
   * 
   * @returns Buffer
   */
  async getContract() {
    const location = this.getContractLocation();

    try {
      const isFile = (await fs.stat(location)).isFile();

      if (!isFile) {
        throw new Error(`Contract not found at '${location}'`);
      }
      
      return zlib.gunzipSync(await fs.readFile(location));
    }
    catch (e) {
      console.error(e);
      throw new Error(`Contract not found at '${location}'`);
    }
  }

  /**
   * Create lock file for the newly deployed contract
   * so we can interact with it from other commands.
   * 
   * @param {string} contractAddress
   * @returns 
   */
  async createLockFile(address) {
    const _path = path.resolve(`${Felony.appRootPath}/.contract_lock`);
    await fs.writeFile(_path, address);
  }

  /**
   * Get contract location on the fs
   * 
   * @returns string
   */
  getContractLocation() {
    return this.payload.contract || `${Felony.appRootPath}/contract.wasm.gz`;
  }

  /**
   * Get the options for the votes
   * 
   * @returns array
   */
  getOptions() {
    if (!this.payload.options) {
      throw new Error("No options provided, please define the options as argument to this command separeted by a comma.");
    }

    return this.payload.options.split(",").map(i => String(i).trim());
  }
}
