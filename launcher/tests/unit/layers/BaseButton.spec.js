import { mount } from '@vue/test-utils'
import BaseButton from "../../../src/components/layers/BaseButton";
test('BackgroundPage contains img tag',()=>{

    const wrapper = mount(BaseButton)
    expect(wrapper.element.button)
})