import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (allowedTypes.indexOf(extension) === -1) {
        return { fileType: true };
      }
    }
    return null;
  };
}
