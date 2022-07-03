import { mount } from "@vue/test-utils";
import TheStorage from "../../../../src/components/UI/the-control/TheStorage.vue";

test("img icon exist", () => {
  const wrapper = shallowMount(TheStorage);
  const img = wrapper.find("img");

  expect(img.exists()).toBe(true);
});
