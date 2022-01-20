import { mount } from "@vue/test-utils";
import BaseButton from "../../../src/components/UI/BaseButton";
test("Button element exists", () => {
  const wrapper = mount(BaseButton);
  const btn = wrapper.find("button");
  expect(btn.exists()).toBe(true);
});
