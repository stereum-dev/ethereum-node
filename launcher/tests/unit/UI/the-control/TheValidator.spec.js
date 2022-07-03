import { mount } from "@vue/test-utils";
import TheValidator from "../../../../src/components/UI/the-control/TheValidator.vue";

test("Img element exists", () => {
  const wrapper = mount(TheValidator);
  const img = wrapper.find("img");

  expect(img.exists()).toBe(true);
});
