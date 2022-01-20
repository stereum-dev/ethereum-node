import { mount } from "@vue/test-utils";
import ClickInstall from "../../../src/pages/ClickInstall";
import OneClick from "../../../src/components/layers/OneClick"

  test("Find a componen which is inside", () => {
    const wrapper = mount(ClickInstall);
    const comp = wrapper.findComponent(OneClick) 
    expect(comp.exists()).toBe(true)
  });

