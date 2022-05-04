import { mount } from '@vue/test-utils'
import LangDialog from '../../../src/components/UI/LangDialog'

test('Props rendered', () => {
  const wrapper = mount(LangDialog, {
    propsData: {
      open: 'open'
    }
  })

  expect(wrapper.props('open')).toBe('open')
})
