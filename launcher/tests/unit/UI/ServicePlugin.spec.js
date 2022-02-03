import { shallowMount } from "@vue/test-utils";
import ServicePlugin from "../../../src/components/UI/ServicePlugin";

test("ServicePlugin contains text", () => {
  const wrapper = shallowMount(ServicePlugin);
  expect(wrapper.find(".serviceCtrl").text()).toEqual("ServicePlugin");
});
