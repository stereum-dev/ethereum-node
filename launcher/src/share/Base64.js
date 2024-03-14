const { Buffer } = require("buffer");

export class Base64 {
  static validate(str, enc = "utf8") {
    try {
      // Attempt to decode the string
      const decoded = Buffer.from(str, "base64").toString(enc);
      // Check if the decoded string is valid
      return Buffer.from(decoded, enc).toString("base64") === str;
    } catch (error) {
      // If an error occurs during decoding, the string is not Base64 or Buffer is missing
      if (typeof Buffer === "undefined") {
        throw new Error(error);
      }
      return false;
    }
  }

  static decode(str, enc = "utf8") {
    return Buffer.from(str, "base64").toString(enc);
  }

  static encode(str, enc = "utf8") {
    return Buffer.from(str, enc).toString("base64");
  }
}
