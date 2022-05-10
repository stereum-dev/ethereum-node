import { mount } from '@vue/test-utils'
import CircleLoading from '../../../src/components/UI/CircleLoading'

test('Props rendered', () => {
  const wrapper = mount(CircleLoading, {
    propsData: {
      message: 'Ubuntu',
      open: true
    }
  })

  expect(wrapper.props().open).toBe(true)
  expect(wrapper.props().message).toBe('Ubuntu')
})
