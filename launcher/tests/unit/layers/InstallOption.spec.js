import { mount } from "@vue/test-utils";
import InstallOption from "../../../src/components/layers/InstallOption";
describe("InstallOption.vue", () => {
  test("renders a router-link tag with to temp.url", () => {
    const wrapper = mount(InstallOption);

    expect(wrapper.find("router-link").exists()).toBe(true);
  });
});
