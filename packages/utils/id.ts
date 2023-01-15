import hyperid, { IdObject, Instance, Options } from 'hyperid';
import short from 'short-uuid';

const opts: Options = {
  urlSafe: true,
};

// short uuid translator
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const translator = short(alphabet);

/**
 * Faster UUIDs that the `node-uuid` or `uuid` package.
 *
 * @type {{
 *  decode: (uuid: string) => hyperid.IdObject,
 *  generate: () => hyperid.Instance,
 *  uuid: () => string
 * }}
 */
const api = {
  /**
   * You probably don't need this and just want `ID.uuid()`.
   * @returns {hyperid.Instance}
   */
  generateHyperid: function generate(): Instance {
    return hyperid(opts);
  },
  /**
   * Generate a UUID.
   *
   * @returns {string}
   */
  uuid: function uuid(): string {
    return this.generateHyperid().uuid;
  },
  /**
   * You can decode a uuid if you really want to.
   *
   * @param {string} uuid
   * @returns {hyperid.IdObject}
   */
  decodeUuid: function decode(uuid: string): IdObject {
    return hyperid.decode(uuid, opts);
  },
  /**
   * Generates a short UUID.
   *
   * @returns {string}
   */
  shortUuid: function shortUuid(): string {
    return this.encodeShortUuid(this.uuid());
  },
  /**
   * You can encode a uuid to a short uuid.
   *
   * @param {string} uuid
   * @returns {string}
   */
  encodeShortUuid: function encode(uuid: string): string {
    return translator.fromUUID(uuid);
  }, /**
   * You can decode a short uuid to uuid.
   *
   * @param {string} shortUuid
   * @returns {string}
   */
  decodeShortUuid: function decode(shortUuid: string): string {
    return translator.toUUID(shortUuid);
  },
};
Object.freeze(api);

export const ID = api;
