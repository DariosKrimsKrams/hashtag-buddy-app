import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { Color } from "tns-core-modules/color";
import { TextField } from "tns-core-modules/ui/text-field";

@Component({
    selector: "FloatLabel",
    moduleId: module.id,
    template: `
        <GridLayout rows="30, auto">
            <Label #label row="1" [text]="placeholder" opacity="0.4" fontSize="14" class="input"></Label>
            <TextField #textField [secure]="secure" row="1" (focus)="onFocus()" (blur)="onBlur()" (textChange)="onChange($event)" color="#000" fontSize="15" borderBottomWidth="2" borderBottomColor="#cec8c8" padding="2"></TextField>
        </GridLayout>
    `
})
export class FloatLabel {
    @Input() placeholder: string;
    @Input() secure: boolean;
    @ViewChild("label") label: ElementRef;
    @ViewChild("textField") textField: ElementRef;
    @Output() userTextEmitter = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

    onFocus() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        label.animate({
            translate: { x: 0, y: - 25 },
            opacity: 1,
        }).then(() => { }, () => { });

        textField.borderBottomColor = new Color('#FFB184');
    }

    onBlur() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        if (!textField.text) {
            label.animate({
                translate: { x: 0, y: 0 },
                opacity: 0.4
            }).then(() => { }, () => { });
        }
        textField.borderBottomColor = new Color('#cec8c8');
    }

    onChange(args) {
        let textField = <TextField>args.object;
        this.userTextEmitter.emit(textField.text);
    }

}
