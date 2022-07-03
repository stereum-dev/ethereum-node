import { mount } from "@vue/test-utils";
import TimeGas from "../../../../src/components/UI/the-control/TimeGas.vue";

test("should exist gas and time containers", () => {
  const wrapper = mount(TimeGas);
  const div = wrapper.find("div");

  expect(div.exists()).toBe(true);
});
