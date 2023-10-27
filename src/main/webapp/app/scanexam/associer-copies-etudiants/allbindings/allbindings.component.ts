import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'jhi-allbindings',
  templateUrl: './allbindings.component.html',
  styleUrls: ['./allbindings.component.scss'],
})
export class AllbindingsComponent implements OnInit {
  students: any[] = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    if (this.config.data?.students) {
      this.students = this.config.data.students;
      console.error(this.students);
    }
  }

  imagedata_to_image(imagedata: ImageData): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx?.putImageData(imagedata, 0, 0);
    return canvas.toDataURL();
  }
}
