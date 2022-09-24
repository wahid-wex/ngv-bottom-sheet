import { ComponentFactory, ComponentFactoryResolver, inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgvBottomSheetOptionModel,NgvRoutesConfig,TemplateCarrierType,OverlayModel  } from '../models';
import { NgvBottomSheetComponent } from '../components/ngv-bottom-sheet/ngv-bottom-sheet.component';
import { NGV_BOTTOM_SHEET_TEMPLATE_TOKEN, NGV_BOTTOM_SHEET_CLOSE_TOKEN ,NGV_BOTTOM_SHEET_ROUTES_TOKEN } from '../classes';

@Injectable({
  providedIn: 'root'
})
export class NgvBottomSheet implements OverlayModel {
  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * @property injector factory componentFactoryResolver
   * these three properties help us to inject NgvBottomSheetComponent into the root
   * @class NgvBottomSheetComponent
   */
  private injector = inject(Injector);
  private factory: ComponentFactory<NgvBottomSheetComponent>;
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  // after close observer
  private afterClose$: Subject<any> = new Subject();

  // list of custom elements that is open
  private componentsOpenedNameList: string[] = [];

  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * these two bridges help us to connect NgvBottomSheetComponent
   * @property templateBridge$ closeBridge$
   * @class NgvBottomSheetComponent
   */
  private templateBridge$: BehaviorSubject<TemplateCarrierType> = inject(NGV_BOTTOM_SHEET_TEMPLATE_TOKEN);
  private closeBridge$: Subject<void> = inject(NGV_BOTTOM_SHEET_CLOSE_TOKEN);
  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * there is some stuffs that help us to open components automatically
   * @property routesConfig
   * contains routes config that have a list of routes and options that how to open that routes
   * @property transformedFragments
   * contains list of routes that we got it from routesConfig, we fill transformedFragments but in form of an object
   * so that we don't have to make redundant iteration
   */

  private routesConfig: NgvRoutesConfig = inject(NGV_BOTTOM_SHEET_ROUTES_TOKEN);
  private transformedFragments = {};
  private router = inject(ActivatedRoute);

  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  constructor() {
    /**
     * in NgvBottomSheetComponent sometimes we need to close the sheet when backdrop clicked
     * we injected token to prevent circular injection
     */
    this.closeBridge$.subscribe(() => {
      this.close();
    });
    /*listening to routes if routes exists*/
    this.openAutomationByRoutes();
  }

  open(component: any, options: NgvBottomSheetOptionModel = {backDropClose: true, backDropStyle: 'blur'}): this {
    // make it empty , use case: when we have two sheets open and last sheet carrying last data options and components
    this.templateBridge$.next(null);
    // create basic of load sheet
    const componentName = this.init();
    // tell bridge what component u should load inside of sheet by what options
    this.templateBridge$.next({component, options, componentName});
    return this;
  }

  getData(): any {
    return this.templateBridge$.getValue().options.data;
  }

  afterClose(): Observable<any> {
    return this.afterClose$.asObservable();
  }

  close(e?): void {
    // get name of last custom element is opened
    const componentUniqueIdentifier = this.componentsOpenedNameList.pop();

    const sheetComponent = document.getElementById(componentUniqueIdentifier + '-content');
    if (!sheetComponent) {
      return;
    }
    // make close animation for 200ms after that remove anything down here
    sheetComponent.style.transition = '200ms linear all';
    sheetComponent.style.bottom = `${sheetComponent.scrollHeight * -1}px`;

    // remove
    setTimeout(() => {
      // tell user what's ur data after close
      this.afterClose$.next(e);
      // clear bridge
      this.templateBridge$.next(null);
      const el = document.getElementsByTagName(componentUniqueIdentifier)[0];
      // remove factory holder and dummy element
      el?.remove();
      if (!this.componentsOpenedNameList.length) {
        document.body.style.overflow = 'visible';
      }
      this.factory = null;
    }, 200);
  }

  private init(): string {
    const name = 'ngv-sheet-container-' + Math.floor(Math.random() * 100000);
    this.componentsOpenedNameList.push(name);
    // make a dummy element
    const el = document.createElement(name);
    // push dummy to body
    document.body.appendChild(el);
    // create component that we want to inject it into the dummy then inject
    this.factory = this.componentFactoryResolver.resolveComponentFactory(NgvBottomSheetComponent);
    this.factory.create(this.injector, [], el);
    document.body.style.overflow = 'hidden';

    return name;
  }

  private openAutomationByRoutes(): void {
    if (!this.routesConfig.list.length) {
      return;
    }
    this.transformFragments();
    this.openSheetWhenFragmentMatches();
  }

  private transformFragments(): void {
    const defaultOption = {backDropClose: true, backDropStyle: 'blur'};
    const userConfig = this.routesConfig.options;
    this.routesConfig.list.map(route => {
      this.transformedFragments[route.fragment] = {
        component: route.component,
        option: {...defaultOption , ...userConfig}
      };
    });
  }

  private openSheetWhenFragmentMatches(): void {
    this.router.fragment.subscribe(fragment => {
      if (this.transformedFragments.hasOwnProperty(fragment)) {
        this.open(this.transformedFragments[fragment].component, this.transformedFragments[fragment].option);
      }
    });
  }
}
