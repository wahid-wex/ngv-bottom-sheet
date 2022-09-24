import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NgvBottomSheetOptionModel ,TemplateCarrierType} from '../../models';
import { NGV_BOTTOM_SHEET_CLOSE_TOKEN , NGV_BOTTOM_SHEET_TEMPLATE_TOKEN } from '../../classes';
import { isMobileOrTablet } from '../../util';

const runDesktopListenersOutside = (handler: HTMLElement, sheet: HTMLElement, close: VoidFunction) => {
  // mouse default setting
  const mouseEvents = {
    mouseDownOnHandler: false,
    screenY: 0,
    movement: 0
  };
  const onMousedown = (e) => {
    sheet.style.transition = null;
    mouseEvents.mouseDownOnHandler = true;
    mouseEvents.screenY = e.screenY;
    mouseEvents.movement = 0;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseUp = (e) => {
    /**
     * we are calculating after mouse up if used swiped down
     * and this swipe more than 50px
     * trigger: close sheet
     */
    if (mouseEvents.mouseDownOnHandler && mouseEvents.screenY < e.screenY && ((mouseEvents.screenY - e.screenY) < -50)) {
      /***
       * Swiping down to hidden sheet.
       */
      close();
    } else if (mouseEvents.mouseDownOnHandler) {
      /***
       * back sheet to first position.
       * because this move is not enough.
       */
      sheet.style.transition = '200ms linear all';
      sheet.style.transform = `translateY(${0}px)`;
    }
    mouseEvents.mouseDownOnHandler = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    /**
     * mouse movement , movement by movement calculating in
     * @property mouseEvents.movement
     * then we move it per mouse move event
     */
    mouseEvents.movement += e.movementY;
    if (mouseEvents.mouseDownOnHandler && mouseEvents.screenY < e.screenY) {
      sheet.style.transform = `translateY(${mouseEvents.movement}px)`;
    }
  };

  handler?.addEventListener('mousedown', onMousedown);
};

const runMobileListenersOutside = (handler: HTMLElement, sheet: HTMLElement, close: VoidFunction) => {
  // touch default setting
  const touchEvents = {
    touchDownOnHandler: false,
    screenY: 0,
    previousTouch: null,
    movement: 0
  };

  /**
   * in touch events when touch ends we haven't any data because touch finished...
   * so we need to calculate movement
   * @property calculateMovement
   * in touch move
   */

  const calculateMovement = (e, touch) => {
    if (touchEvents.previousTouch) {
      e.movementY = touch.pageY - touchEvents.previousTouch.pageY;
    } else {
      e.movementY = 0;
    }
  };

  const ontouchstart = (e) => {
    sheet.style.transition = null;
    touchEvents.touchDownOnHandler = true;
    touchEvents.screenY = e.targetTouches[0].screenY;
    touchEvents.movement = 0;
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  const onTouchEnd = (e) => {
    if (touchEvents.touchDownOnHandler &&
      touchEvents.screenY < touchEvents.previousTouch.screenY &&
      ((touchEvents.screenY - touchEvents.previousTouch.screenY) < -50)) {
      /***
       * Swiping down to hidden sheet.
       */
      close();
    } else if (touchEvents.touchDownOnHandler) {
      /***
       * back sheet to first position.
       * because this move is not enough.
       */
      sheet.style.transition = '200ms linear all';
      sheet.style.transform = `translateY(${0}px)`;
    }
    touchEvents.touchDownOnHandler = false;
    touchEvents.previousTouch = null;
  };

  const onTouchMove = (e) => {
    calculateMovement(e, e.touches[0]);
    // getting last touch because of that we haven't any data in touchend event, because it is finished.
    touchEvents.previousTouch = e.touches[0];
    touchEvents.movement += e.movementY;
    if (touchEvents.touchDownOnHandler && touchEvents.screenY < e.targetTouches[0].screenY) {
      sheet.style.transform = `translateY(${touchEvents.movement}px)`;
    }
  };

  handler?.addEventListener('touchstart', ontouchstart);
};

@Component({
  selector: 'ngv-bottom-sheet',
  templateUrl: './ngv-bottom-sheet.component.html',
  styleUrls: ['./ngv-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NgvBottomSheetComponent {
  subscription: Subscription;
  changeDetectorRef = inject(ChangeDetectorRef);
  templateBridge$: BehaviorSubject<TemplateCarrierType> = inject(NGV_BOTTOM_SHEET_TEMPLATE_TOKEN);
  closeBridge$: Subject<void> = inject(NGV_BOTTOM_SHEET_CLOSE_TOKEN);
  zone = inject(NgZone);
  @ViewChild('container', {static: true, read: ViewContainerRef})
  container: ViewContainerRef;

  componentName = 'Ngv';
  // default options
  options: NgvBottomSheetOptionModel = {
    backDropStyle: 'blur',
    backDropClose: true,
    space: 16
  };

  constructor() {
    /**
     * here we are listening to bridge to get new component and options
     */
    this.subscription = this.templateBridge$.subscribe((res) => {
      if (res) {
        this.options = {...this.options, ...res.options};
        this.createComponent(res.component);
        this.componentName = res.componentName;
        this.changeDetectorRef.detectChanges();
        this.swipeFunction(res);
      }
    });
  }

  close(): void {
    if (this.options.backDropClose) {
      this.closeBridge$.next();
    }
  }

  createComponent(component: any): void {
    this.container.createComponent(component);
    this.changeDetectorRef.detectChanges();
    this.subscription.unsubscribe();
    document.getElementsByClassName('ngv-bottom-sheet')[0].classList.add('show');
  }

  swipeFunction(response): void {
    this.zone.runOutsideAngular(() => {
      const handler = document.getElementById('sheet-handler');
      const sheet = document.getElementById(response.componentName + '-content');
      /**
       * we will run this code outside angular (no detection on listeners) , so we have better run time performance
       */
      if (isMobileOrTablet()) {
        runMobileListenersOutside(handler, sheet, this.close.bind(this));
      } else {
        runDesktopListenersOutside(handler, sheet, this.close.bind(this));
      }
    });
  }
}

