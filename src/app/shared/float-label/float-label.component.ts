import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { Color } from "tns-core-modules/color";

@Component({
    selector: "FloatLabel",
    moduleId: module.id,
    template: `
        <GridLayout rows="30, auto">
            <Label #label row="1" [text]="placeholder" opacity="0.4" fontSize="14" class="input"></Label>
            <TextField #textField [secure]="secure" row="1"  (focus)="onFocus()" (blur)="onBlur()" borderBottomWidth="2" borderBottomColor="#cec8c8" padding="2"></TextField>
        </GridLayout>
    `
})
export class FloatLabel {
    @Input() placeholder: string;
    @Input() secure: boolean;
    @ViewChild("label") label: ElementRef;
    @ViewChild("textField") textField: ElementRef;

    constructor() {
    }

    ngOnInit(): void {
    }

    onFocus() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        // animate the label sliding up and less transparent.
        label.animate({
            translate: { x: 0, y: - 25 },
            opacity: 1,
        }).then(() => { }, () => { });

        // set the border bottom color to green to indicate focus
        textField.borderBottomColor = new Color('#00b47e');
    }

    onBlur() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        // if there is text in our input then don't move the label back to its initial position.
        if (!textField.text) {
            label.animate({
                translate: { x: 0, y: 0 },
                opacity: 0.4
            }).then(() => { }, () => { });
        }
        // reset border bottom color.
        textField.borderBottomColor = new Color('#cec8c8');
    }
}
