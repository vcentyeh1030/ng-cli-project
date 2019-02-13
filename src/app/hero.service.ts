import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
  constructor(private http: HttpClient, private messageSerivce: MessageService) { }
  // getHeroes(): Hero[] {
  // 	return HEROES;
  // }
  private log(message: string) {
    this.messageSerivce.add('HeroService: ' + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]> {
  	// this.messageSerivce.add('HeroService: fetched heros');
  	// return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(heroes => this.log(`fetched heroes`)), catchError(this.handleError('getHeroes', [])));
  }
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
  	// this.messageSerivce.add(`HeroService: fetched hero id=${id}`);
  	// return of(HEROES.find(hero => hero.id === id));
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`fetched hero id=${id}`)), catchError(this.handleError<Hero>(`getHero id=${id}`)));
  }
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url).pipe(map(heroes => heroes[0]), tap(h => {const outcome = h? `fetched`: `did not find`; this.log(`${outcome} hero id=${id}`)}), catchError(this.handleError<Hero>(`getHero id=${id}`)));
  }
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(tap(_ => this.log(`updated hero id=${hero.id}`), catchError(this.handleError<any>('updateHero'))), );
  }
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)), catchError(this.handleError<Hero>('addHero')));
  }
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero: hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(tap(_ => this.log(`deleted hero id=${id}`)), catchError(this.handleError<Hero>('deleteHero')));
  }
  searchHeros(term: string): Observable<Hero[]> {
    if(!term.trim()) {return of([]);}
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(tap(_ => this.log(`found heroes matching "${term}"`)), catchError(this.handleError<Hero[]>('searchHeroes', [])));
  }
}
