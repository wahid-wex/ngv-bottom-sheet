import { NgvBottomSheetOptionModel } from './';

export interface OverlayModel {
  open(component: any, options?: NgvBottomSheetOptionModel): void;

  getData(): any;

  afterClose(): Promise<any>;

  close(e?): void;
}
