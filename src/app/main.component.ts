import { Component } from '@angular/core';
import { Step01Component } from './step_01/app.component';
import { Step02Component } from './step_02/app.component';
import { Step03Component } from './step_03/app.component';
import { Step04Component } from './step_04/app.component';
import { Step05Component } from './step_05/app.component';
import { Step06Component } from './step_06/app.component';

export const ROUTES = [
    { path: 'step06', component: Step06Component },
    { path: 'step05', component: Step05Component },
    { path: 'step04', component: Step04Component },
    { path: 'step03/:current', component: Step03Component },
    { path: 'step03', component: Step03Component },
    { path: 'step02/:type/:car/:model', component: Step02Component },
    { path: ':current', component: Step01Component },
    { path: '', component: Step01Component }
]

@Component({
    selector: 'body',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {

    constructor() {
        // console.log("@@constructor");
    }

    ngOnChanges() {
        // console.log("@@@ngOnChanges");
    }

    ngOnInit() {
        // console.log("@@@ngOnInit");
    }

    ngDoCheck() {
        // console.log("@@@ngDoCheck");
    }

    ngAfterContentInit() {
        // console.log("@@@ngAfterContentInit");
    }

    ngAfterContentChecked() {
        // console.log("@@@ngAfterContentChecked");
    }

    ngAfterViewInit() {
        // console.log("@@@ngAfterViewInit");
    }

    ngAfterViewChecked() {
        // console.log("@@@ngAfterViewChecked");
    }

    ngOnDestroy() {
        // console.log("@@@ngOnDestroy");
    }

    // ヘッダをタップした時
    tapedhead() {
        location.href = '/';

    }

}
