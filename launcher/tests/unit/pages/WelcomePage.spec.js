import { mount } from "@vue/test-utils";
import WelcomePage from "../../../src/pages/WelcomePage";
// import InstallationMenu from "../../../src/components/layers/InstallationMenu";
import BackgroundPage from "../../../src/components/layers/BackgroundPage";

test("Should contains 2 other components", () => {
  const wrapper = mount(WelcomePage);
  const BgPage = wrapper.findComponent({ name: "BackgroundPage" });
  expect(BgPage.exists()).toBe(true);
});
