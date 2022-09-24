import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgvBottomSheetComponent } from './components/ngv-bottom-sheet/ngv-bottom-sheet.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { NGV_BOTTOM_SHEET_CLOSE_TOKEN, NGV_BOTTOM_SHEET_TEMPLATE_TOKEN, NGV_BOTTOM_SHEET_ROUTES_TOKEN } from './classes';
import { TemplateCarrierType ,NgvRoutesConfig} from './models';

@NgModule({
  declarations: [
    NgvBottomSheetComponent
  ],
  providers: [
    {
      provide: NGV_BOTTOM_SHEET_TEMPLATE_TOKEN, useFactory: (() => {
        return new BehaviorSubject<TemplateCarrierType>(null);
      })
    },
    {
      provide: NGV_BOTTOM_SHEET_CLOSE_TOKEN, useFactory: (() => {
        return new Subject<void>();
      })
    },
  ],
  imports: [
    CommonModule
  ]
})
export class NgvBottomSheetModule {
  static setRoutes(routes: NgvRoutesConfig): ModuleWithProviders<NgvBottomSheetModule> {
    return {
      ngModule: NgvBottomSheetModule,
      providers: [
        {
          provide: NGV_BOTTOM_SHEET_ROUTES_TOKEN,
          useValue: routes
        }
      ]
    };
  }
}
