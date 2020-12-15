import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metsColor'
})
export class MetsColorPipe implements PipeTransform {

  transform(mets_id: unknown): string {
    if (mets_id == 1) {
      return "danger"
    } else if (mets_id == 2) {
      return "warning"
    } else if (mets_id == 3) {
      return "info"
    } else if (mets_id == 4) {
      return "success"
    } else {
      throw new Error("Mets ID must be 1-4")
    }
  }

}
