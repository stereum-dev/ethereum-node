import { mount } from "@vue/test-utils";
import InstallationMenu from "../../../src/components/layers/InstallitionMenu";

test("InstallationMenu", () => {
  const wrapper = mount(InstallationMenu);
  expect(wrapper.classes("dell")).toBe(false);
});
