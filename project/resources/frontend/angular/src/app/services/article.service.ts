import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiBaseUrl = `http://localhost:8000/api/articles`;
  private mock: boolean = false;

  articles$: BehaviorSubject<Article[]>;
  articles: Array<Article> = [];

  constructor(
    private http: HttpClient
  ) {
    this.articles$ = new BehaviorSubject([]);
  }

  getAll() {
    if (this.mock) {
      this.articles = [{ "id": 1, "title": "Article 1", "content": "Article content.", "created_at": "2021-10-04T15:02:45.000000Z", "updated_at": "2021-10-04T15:02:45.000000Z" }];
      this.articles$.next(this.articles);
    }
    else {
      this.http.get<Article[]>(this.apiBaseUrl).pipe(
        first(),
        catchError(error => {
          console.log(error);
          return of([]);
        })
      ).subscribe((articles: any) => {
        this.articles = articles.data;
        this.articles$.next(this.articles);
      });
    }
  }

  add(article: Article) {
    this.http.post<any>(`${this.apiBaseUrl}`, article).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return EMPTY;
      })
    ).subscribe(res => {
      article.id = res.data.id;
      this.articles.push(article);
      this.articles$.next(this.articles);
    });
  }

  edit(article: Article) {
    let findElem = this.articles.find(p => p.id == article.id);
    findElem.title = article.title;
    findElem.content = article.content;
    findElem.updated_at = new Date().toString();

    this.http.put<any>(`${this.apiBaseUrl}/${article.id}`, findElem).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.articles$.next(this.articles);
    });
  }

  remove(id: number) {
    this.http.delete<any>(`${this.apiBaseUrl}/${id}`).pipe(
      first(),
      catchError(error => {
        console.log(error);
        return EMPTY;
      })
    ).subscribe(() => {
      this.articles = this.articles.filter(p => {
        return p.id != id
      });

      this.articles$.next(this.articles);
    });
  }
}
