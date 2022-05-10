import { mount } from '@vue/test-utils'
import FooterNode from '../../../src/components/layers/FooterNode'

test('Text should be rendered in component', () => {
  const wrapper = mount(FooterNode)
  expect(wrapper.text()).toContain('SYSTEM ALERT')
})
