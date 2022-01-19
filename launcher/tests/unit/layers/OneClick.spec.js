import { mount} from '@vue/test-utils';
import OneClick from '../../../src/components/layers/OneClick';

describe('OneClick.vue',()=>{
    // test("Check that the data contains image", () => {
    //     const wrapper = mount(OneClick);
    //     wrapper.R1clkInstls.findAll(img)
    //     const img = item.length
    //     expect(img).toBe(1);
    //     });

    test('setData demo', async () => {
        const wrapper = mount(OneClick)
      
        await wrapper.setData({ R1clkInstls:"testData"})
      
        expect(wrapper.vm.R1clkInstls).toBe('testData')
      })
})