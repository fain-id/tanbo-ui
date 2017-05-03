import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { UiComponentsModule } from '../modules/ui-components/ui-components.module';
import { UiFormsModule } from '../modules/ui-forms/ui-form.module';

import { AppComponent } from './app';

@NgModule({
    imports: [
        UiComponentsModule,
        UiFormsModule,
        BrowserModule
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
