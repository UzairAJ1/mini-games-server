module.exports = class ServiceBase {
  get isInitialized() {
    return this.hasOwnProperty("_isInitialized") ? this._isInitialized : false;
  }
  set isInitialized(val) {
    this._isInitialized = val;
  }
  get instance() {
    if (this.hasOwnProperty("_instance")) {
      return this._instance;
    }
    if (this.isInitialized) {
      throw Error(
        `"Initialize" method was called but "${this.name}" Service was not initialized properly`
      );
    } else {
      throw Error(
        `"${this.name}" Service is not yet initialized. Call "initialize" method first.`
      );
    }
  }
  set instance(val) {
    return (this._instance = val);
  }
  async _initialize() {
    throw Error(`Not defined in ${this.name}`);
  }
  async initialize(config) {
    if (!this.isInitialized) {
      this.isInitialized = true;
      try {
        this.instance = await this._initialize(config);
      } catch (error) {
        console.error("Error Initializing:", this.name, error);
        throw error;
      }
    }
    return this.knex;
  }
  async _destroy() {
    throw Error(`Not defined in ${this.name}`);
  }
  async destroy() {
    await this._destroy();
  }
};
