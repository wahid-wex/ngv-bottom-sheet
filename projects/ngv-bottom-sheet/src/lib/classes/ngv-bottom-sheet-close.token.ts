import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

export const NGV_BOTTOM_SHEET_CLOSE_TOKEN = new InjectionToken<Subject<void>>(null);
