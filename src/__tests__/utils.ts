import { VueWrapper } from "@vue/test-utils";
import { DefineComponent, ComputedOptions, ComponentPublicInstance, ref, reactive, watch, watchEffect } from "vue";

/**
 * Fix the SFC type from vuedx to a valid defineComponentType
 * @param o  SFC component
 */
export function fixSFCType<T, CX extends ComputedOptions = {}>(o: T):
  T extends DefineComponent<infer PropsOrPropOptions, infer RawBindings, infer D, CX, infer M, infer Mixin, infer Extends, infer E, infer EE, infer PP, infer Props, infer Defaults> ?
  DefineComponent<PropsOrPropOptions, RawBindings, unknown extends D ? unknown : D, CX, M, Mixin, Extends, E, EE, PP, Props, Defaults>
  : false {
  return o as any
}


/**
 * Mocks the vmodel as a `ref`
 * @param wrapper 
 * @param prop 
 */
export function mockVModel<VueComponent extends ComponentPublicInstance>(wrapper: VueWrapper<VueComponent>, prop?: keyof VueComponent['$props']) {
  const name: keyof keyof VueComponent['$props'] = prop || 'value' as any
  const vmodel = ref(wrapper.vm.$props[name])

  const e = wrapper.vm.$.emit;
  // wrapper.trigger()
  wrapper.vm.$.emit = (event, ...args) => {
    e(event, ...args)
    if (event === "update:" + name) {
      wrapper.setProps({
        [name]: args[0]
      })

      vmodel.value = args[0]
    }
  }

  return vmodel;
}