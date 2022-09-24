import { NgvBottomSheetOptionModel } from './';

export interface NgvRoutes {
  fragment: string;
  component: {};
}

export interface NgvRoutesConfig {
  list: NgvRoutes[];
  options?: NgvBottomSheetOptionModel;
}
