import { mount } from "@vue/test-utils";
import BaseHome from "../../../src/pages/BaseHome";
import TheFirst from "../../../src/pages/TheFirst"

describe("BaseHome.vue", () => {
  test("Find a componen which is inside", () => {
    const wrapper = mount(BaseHome);
    const comp = wrapper.findComponent(TheFirst) 
    expect(comp.exists()).toBe(true)
  });
});
