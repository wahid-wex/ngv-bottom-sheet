import { Observable } from 'rxjs';
import { NgvBottomSheetOptionModel } from './';

export interface OverlayModel {
  open(component: any, options?: NgvBottomSheetOptionModel): void;

  getData(): any;

  afterClose(): Observable<any>;

  close(e?): void;
}
