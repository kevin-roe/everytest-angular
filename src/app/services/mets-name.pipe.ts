import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metsName'
})
export class MetsNamePipe implements PipeTransform {

  transform(mets_id: unknown): string {
    if (mets_id == 1) {
      return "Critical"
    } else if (mets_id == 2) {
      return "High"
    } else if (mets_id == 3) {
      return "Medium"
    } else if (mets_id == 4) {
      return "Low"
    } else {
      throw new Error("Mets ID must be 1-4")
    }
  }

}
