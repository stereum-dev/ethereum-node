import { AnsibleUtils } from "../../AnibleUtils";

const playbookExample = `
Nov 10 2021 10:42:53 - all-done.yaml - Gathering Facts - gather_facts - OK - omitted

Nov 10 2021 10:43:53 - all-done.yaml - sleep - shell - OK - {"module_args": {"_raw_params": "sleep 60", "_uses_shell": true, "warn": false, "stdin_add_newline": true, "strip_empty_ends": true, "argv": null, "chdir": null, "executable": null, "creates": null, "removes": null, "stdin": null}} => {"changed": true, "stdout": "", "stderr": "", "rc": 0, "cmd": "sleep 60", "start": "2021-11-10 10:42:53.889323", "end": "2021-11-10 10:43:53.900272", "delta": "0:01:00.010949", "msg": "", "stdout_lines": [], "stderr_lines": [], "_ansible_no_log": false}

Nov 10 2021 10:43:53 - all-done.yaml - All done - debug - OK - {"msg": "All done!", "_ansible_verbose_always": true, "_ansible_no_log": false, "changed": false}`;

test("parsePlaybookOutput success", async () => {
  const parsedOutput = AnsibleUtils.parsePlaybookOutput(playbookExample);

  expect(parsedOutput).toHaveLength(2);

  expect(parsedOutput[0]).toHaveLength(2);
  expect(parsedOutput[0][0].module_args._raw_params).toMatch(/sleep 60/);
  expect(parsedOutput[0][1].cmd).toMatch(/sleep 60/);

  expect(parsedOutput[1]).toHaveLength(1);
  expect(parsedOutput[1][0].msg).toMatch("All done!");
});

test("parsePlaybookOutput empty", async () => {
  const parsedOutput = AnsibleUtils.parsePlaybookOutput("");

  expect(parsedOutput).toHaveLength(0);
});
