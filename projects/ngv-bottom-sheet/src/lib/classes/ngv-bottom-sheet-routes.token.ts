import { InjectionToken } from '@angular/core';
import { NgvRoutesConfig } from '../models';


export const NGV_BOTTOM_SHEET_ROUTES_TOKEN = new InjectionToken<NgvRoutesConfig>('',{
  factory: () => {
    return {
      list: []
    };
  }
});
