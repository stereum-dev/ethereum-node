import { mount } from "@vue/test-utils";
import ControlPanel from "../../../src/pages/ControlPanel";
import ControlGrid from "../../../src/components/UI/ControlGrid";

test("ControlPanel contains child components", () => {
  const wrapper = mount(ControlPanel);
  const bar = wrapper.findComponent(ControlGrid);
  expect(bar.exists()).toBe(true);
});
