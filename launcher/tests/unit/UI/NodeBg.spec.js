import { mount } from '@vue/test-utils'
import NodeBg from '../../../src/components/UI/NodeBg'

test('NodeBg default slot', () => {
  const wrapper = mount(NodeBg, {
    slots: {
      default: 'div Content'
    }
  })

  expect(wrapper.html()).toContain('div Content')
})
