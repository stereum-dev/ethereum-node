import { mount } from "@vue/test-utils";
import OneClick from "../../../src/components/layers/OneClick";

test("setData demo", async () => {
  const wrapper = mount(OneClick);

  await wrapper.setData({ R1clkInstls: "testData" });

  expect(wrapper.vm.R1clkInstls).toBe("testData");
});
