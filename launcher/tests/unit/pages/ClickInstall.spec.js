import { mount } from "@vue/test-utils";
import ClickInstall from "../../../src/pages/ClickInstall";
import InstallOption from "../../../src/components/layers/InstallOption";

test("InstallOption Comp exists insdie of ClickInstall", () => {
  const wrapper = mount(ClickInstall);

  expect(wrapper.findComponent(InstallOption).exists()).toBe(true);
});
