/**
 * Adds an entry to a service configuration's command list.
 *
 * Only the command list is searched for the entry to hang the new one behind.
 * An env var can carry "--" values of its own - Lodestar's NODE_OPTIONS holds
 * "--max-old-space-size" - and the env block comes after the command list in a
 * configuration, so looking at the whole file would append the entry inside
 * that variable instead of the command list.
 *
 * @param {string} yaml a service configuration
 * @param {string} entry the entry to add, e.g. "--enr.ip=80.249.121.1"
 * @returns {string|null} the configuration with the entry added, or null when
 *   there is no command list to add it to
 */
export function addCommandEntry(yaml, entry) {
  const block = /^command:[ \t]*\n((?:[ \t]*-[^\n]*\n?)+)/m.exec(yaml);
  if (!block) return null;

  const entries = block[1].split("\n").filter((line) => line.trim());
  if (!entries.length) return null;

  const last = entries[entries.length - 1];
  const indent = /^[ \t]*-[ \t]*/.exec(last)[0];
  const insertAt = block.index + block[0].lastIndexOf(last) + last.length;

  return yaml.slice(0, insertAt) + "\n" + indent + entry + yaml.slice(insertAt);
}

/**
 * Puts a flag into the env var that carries it.
 *
 * Whatever else the variable holds is kept - the flag is only one part of its
 * value - and a service that does not have the variable at all gets it added to
 * its env block, where "env: {}" has to become a block mapping first.
 *
 * @param {string} yaml a service configuration
 * @param {string} envName the env var the flag belongs to, e.g. "NODE_OPTIONS"
 * @param {string} flag the flag to put there, e.g. "--max-old-space-size=8192"
 * @returns {string|null} the configuration with the flag set, or null when it
 *   has no env block to add the variable to
 */
export function setEnvFlag(yaml, envName, flag) {
  const line = new RegExp(`^([ \\t]*${envName}:[ \\t]*)(.*)$`, "m").exec(yaml);
  if (line) {
    const value = line[2].replace(/^["'`]|["'`]$/g, "").trim();
    return yaml.replace(line[0], `${line[1]}"${value ? value + " " : ""}${flag}"`);
  }

  const entry = `  ${envName}: "${flag}"`;
  if (/^env:[ \t]*\{[ \t]*\}[ \t]*$/m.test(yaml)) {
    return yaml.replace(/^env:[ \t]*\{[ \t]*\}[ \t]*$/m, `env:\n${entry}`);
  }
  if (/^env:[ \t]*$/m.test(yaml)) {
    return yaml.replace(/^env:[ \t]*$/m, `env:\n${entry}`);
  }
  return null;
}
