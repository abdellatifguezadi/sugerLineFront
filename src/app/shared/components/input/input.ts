import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.html',
  styleUrls: ['./input.css']
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() id: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() errorMessage: string = 'Ce champ est obligatoire';

  showPassword = false;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.control.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}