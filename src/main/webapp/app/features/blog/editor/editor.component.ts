import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../../../core/store';
import { Article } from '../../../core/store/article/article.model';
import { slices } from '../../../core/store/util';
import * as EntityActions from '../../../core/store/entity/entity.actions';

@Component({
    selector: 'jhi-editor-component',
    templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit, OnDestroy {
    articleSub: Subscription;
    article: Article;
    articleForm: FormGroup;
    tagField = new FormControl();
    errors: Object = {};
    isSubmitting = false;

    constructor(
        private store: Store<fromRoot.RootState>,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {
        // use the FormBuilder to create a form group
        this.articleForm = this.fb.group({
            title: '',
            description: '',
            body: '',
        });
        // Optional: subscribe to value changes on the form
        // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
    }

    ngOnInit() {
        this.articleSub = this.store.select(fromRoot.getSelectedArticle).subscribe((article) => {
            if (article) {
                this.articleForm.patchValue(article);
            }
        });
    }

    addTag() {
        // retrieve tag control
        const tag = this.tagField.value;
        // only add tag if it does not exist yet
        if (this.article.tagList.indexOf(tag) < 0) {
            this.article.tagList.push(tag);
        }
        // clear the input
        this.tagField.reset('');
    }

    removeTag(tagName: string) {
        this.article.tagList = this.article.tagList.filter((tag) => tag !== tagName);
    }

    submitForm() {
        this.isSubmitting = true;

        this.store.dispatch(new EntityActions.Update(slices.ARTICLE, this.articleForm.value));
        // (article) => this.router.navigateByUrl('/article/' + article.slug),  TODO: handle routing on success
    }

    ngOnDestroy() {
        this.articleSub && this.articleSub.unsubscribe();
    }
}