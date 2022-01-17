import { mount } from '@vue/test-utils'
import SandClock from "../../../src/components/UI/SandClock";

describe('SandClock.vue',()=>{
    test('Props rendered', ()=>{
      const wrapper = mount(SandClock)
      expect(wrapper.classes()).toContain('hourglass')
    })
})
  