import { observable, action, makeObservable, computed } from 'mobx';
import { ReactElement, ReactNode } from 'react';
import { BottomSheetModalProps } from '@gorhom/bottom-sheet';
interface IOptions {
  isOpen?: boolean;
  bottomSheetModalConfig: Omit<
    BottomSheetModalProps,
    'snapPoints' | 'children'
  >;
}
export class ModalStore {
  @observable
  protected options: IOptions;
  protected children: ReactElement | ReactNode;

  constructor() {
    this.options = {
      isOpen: false,
      bottomSheetModalConfig: null
    };

    makeObservable(this);
  }

  // @action
  // setOpen() {
  //   this.isOpen = true;
  // }
  @action
  setOptions(options?: IOptions) {
    this.options = {
      ...options,
      isOpen: true
    };
  }

  // @computed
  // get getState() {
  //   return this.isOpen;
  // }
  @computed
  get getOptions() {
    return this.options;
  }

  @action
  setChildren(children: ReactElement | ReactNode) {
    this.children = children;
  }

  @action
  getChildren() {
    return this.children;
  }

  @action
  close() {
    this.options = {
      isOpen: false,
      bottomSheetModalConfig: null
    };
    this.children = null;
  }
}
