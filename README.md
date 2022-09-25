# NgvBottomSheet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## How to use ?


* `npm install ngv-bottom-sheet` - to install package in your project.
* In your AppModule import the NgvBottomSheetModule
* then in your component use `NgvBottomSheet` to work with that
```ts
import { NgvBottomSheetModule } from 'ngv-bottom-sheet';
imports: [
    ...
    NgvBottomSheetModule,
    ...
]
```

```ts
import { NgvBottomSheet } from 'ngv-bottom-sheet';
@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  bottomSheet = inject(NgvBottomSheet);
  openBottomSheet(): void {
    this.bottomSheet.open(MyExampleComponent)
  }
}

```

* you can set some configuration like the below code :
* `backDropClose` - a boolean value , to be able to close bottom sheet by click to backdrop.
* `space` - a number value , the space around bottom sheet and content.
* `backDropStyle` - a string value , could be `none` for default value , `blur` and `gray`.

```ts
this.bottomSheet.open(MyExampleComponent, {
  backDropClose: true,
  space: 16,
  backDropStyle: 'blur',
})
```

* as you can see at below code, use can use set a data to use it when bottom sheet opened.

```ts
this.bottomSheet.open(MyExampleComponent, {
  data: {
    userData: {
      gitHub: 'https://github.com/wahidwex'
    }
  }
})
```

* you can close bottom sheet by use `close('your message')` that could be any type and send a message to close subscriber.

```ts
this.bottomSheet.open(MyExampleComponent).afterClose().then(closeMessage => {
  // there will got 'my close message could be any type'
})

// and in the MyExampleComponent you can close it
 closeAction(): void {
  this.bottomsheet.close('my close message could be any type')
}
```


```ts
import { NgvBottomSheet } from 'ngv-bottom-sheet';
@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class MyExampleComponent implements OnInit {
  bottomSheet = inject(NgvBottomSheet);
  ngOnInit(): void {
    const data = this.bottomSheet.getData();
    ...
  }
}
```

## How to open bottom sheet by routes?

* when you want to import the module , which will open your bottom sheet as you want , like below
```ts
import { NgvBottomSheetModule } from 'ngv-bottom-sheet';
imports: [
    ...
    NgvBottomSheetModule.setRoutes({
      options : {
        backDropClose: true,
        space: 16,
        backDropStyle: 'blur',
      },
      list: [
        {
          fragment: 'article',
          component: ArticleComponent
        },
        {
          fragment: 'example',
          component: MyExampleComponent
        },
      ],
    }),
    ...
]
```
* so when you want to open `MyExampleComponent` you just need to add `example` fragment ...
