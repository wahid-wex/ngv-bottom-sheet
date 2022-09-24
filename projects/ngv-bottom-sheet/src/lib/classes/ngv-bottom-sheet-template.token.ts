import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateCarrierType } from '../models';

export const NGV_BOTTOM_SHEET_TEMPLATE_TOKEN = new InjectionToken<BehaviorSubject<TemplateCarrierType>>(null);
