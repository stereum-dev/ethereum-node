import { mount } from '@vue/test-utils'
import BackgroundPage from "../../../src/components/layers/BackgroundPage";
test('BackgroundPage contains img tag',()=>{

    const wrapper = mount(BackgroundPage)
    expect(wrapper.element.img)
})