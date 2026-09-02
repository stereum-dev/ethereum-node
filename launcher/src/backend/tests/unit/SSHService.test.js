import { SSHService } from "../../SSHService.js";

// Anything that queries the node before a connection exists used to die on
// "Cannot read properties of undefined (reading 'exec')", because execCommand
// called conn.exec on an empty pool. That message named the symptom rather than
// the cause, which made it hard to place (it reached the log as
// "Can't read services configurations: TypeError: ...").
test("execCommand reports a missing connection instead of throwing", async () => {
  const ssh = new SSHService();
  expect(ssh.connectionPool).toHaveLength(0);

  await expect(ssh.execCommand("ls -1 /etc/stereum/services")).resolves.toEqual({
    rc: -1,
    stdout: "",
    stderr: "Not connected!",
  });
});

test("the missing connection result is treated as an exec error", async () => {
  const ssh = new SSHService();

  const result = await ssh.execCommand("ls");

  // callers branch on checkExecError, so the guard has to look like a failure
  expect(SSHService.checkExecError(result)).toBe(true);
  expect(SSHService.extractExecError(result)).toMatch("Not connected!");
});

test("logging out still short circuits before the pool is consulted", async () => {
  const ssh = new SSHService();
  ssh.loggingOut = true;

  await expect(ssh.execCommand("ls")).resolves.toEqual({ rc: -1, stdout: "", stderr: "Logging Out!" });
});
