import { mount } from "@vue/test-utils";
import TheTime from "../../../../src/components/UI/the-control/TheTime.vue";

test("sand-clock component exists", () => {
  const wrapper = mount(TheTime);
  const sandcomp = wrapper.find("sand-clock");

  expect(sandcomp.exists()).toBe(true);
});
