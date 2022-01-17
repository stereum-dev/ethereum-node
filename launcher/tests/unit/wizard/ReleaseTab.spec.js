import { mount } from '@vue/test-utils'
import ReleaseTab from '../../../src/components/wizard/ReleaseTab';


describe('ReleaseTab.vue', () => {
    test('Props rendered', () => {
        const wrapper = mount(ReleaseTab, {
            propsData: {
                pr: 'releases',
            }
        })
        expect(wrapper.props().pr).toBe('releases')

    })
})