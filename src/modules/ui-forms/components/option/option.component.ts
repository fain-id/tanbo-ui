import { Component, Input, Output, EventEmitter, ViewContainerRef, ElementRef, AfterViewInit } from '@angular/core';
import { SelectComponent } from '../select/select.component';
@Component({
    selector: 'ui-option',
    templateUrl: './option.component.html'
})
export class OptionComponent implements AfterViewInit {
    @Input()
    value: string = '';
    @Input()
    disabled: boolean = false;
    @Output()
    checked = new EventEmitter<OptionComponent>();
    text: string = '';

    get selected() {
        if (this.parentComponent instanceof SelectComponent) {
            return this.value === this.parentComponent.value;
        }
        return false;
    };

    get isDisabled() {
        let isDisabled = (this as any).hasOwnProperty('disabled');
        return isDisabled && this.disabled !== false;
    }

    private parentComponent: SelectComponent;

    constructor(private viewContainerRef: ViewContainerRef,
                private elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        this.parentComponent = this.viewContainerRef.parentInjector.get(SelectComponent);
        this.text = this.elementRef.nativeElement.innerText;
    }

    updateSelectValue() {
        if (!this.isDisabled) {
            this.checked.emit(this);
        }
    }
}