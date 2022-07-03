import { mount } from "@vue/test-utils";
import ValidatorContainerBox from "../../../../src/components/UI/the-control/ValidatorContainerBox.vue";

test("should validatorContainerBox exist", () => {
  const wrapper = mount(ValidatorContainerBox);
  const div = wrapper.find("div");

  expect(div.exists()).toBe(true);
});
