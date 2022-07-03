import { mount } from "@vue/test-utils";
import TheRam from "../../../../src/components/UI/the-control/TheRam.vue";

test("ram symbol exist", () => {
  const wrapper = shallowMount(TheRam);
  const img = wrapper.find("img");

  expect(img.exists()).toBe(true);
});
