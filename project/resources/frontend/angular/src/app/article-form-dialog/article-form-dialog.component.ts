
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '../models/article';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './article-form-dialog.component.html',
  styleUrls: ['./article-form-dialog.component.scss']
})

export class ArticleFormDialogComponent {

  formInstance: FormGroup;

  constructor(public dialogRef: MatDialogRef<ArticleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Article) {
    
    this.formInstance = new FormGroup({
      "id": new FormControl({ value: '', disabled: !!data.id ? true: false }, Validators.required),
      "title": new FormControl('', Validators.required),
      "content": new FormControl('', Validators.required),
      "updated_at": new FormControl({ value: '', disabled: !!data.updated_at ? true : false }, Validators.required),
      "created_at": new FormControl({ value: '', disabled: !!data.created_at ? true : false}, Validators.required),
    });

    this.formInstance.setValue(data);
  }

  save(): void {
    let article: Article = Object.assign(new Article(), {
      id: this.data.id,
      title: this.formInstance.value.title,
      content: this.formInstance.value.content,
      updated_at: new Date().toISOString(),
      created_at: this.data.created_at,
    });

    this.dialogRef.close(article);
  }
}