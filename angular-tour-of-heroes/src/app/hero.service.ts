import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


import { Hero } from './hero';

@Injectable({
  providedIn: 'root'
})
export class HeroService 
{
  constructor(private messagesService : MessageService, private http : HttpClient) { }

  private heroesUrl = "api/heroes";
  httpOptions = { headers: new HttpHeaders( { "Content-Type" : "application/json"} ) };

  getHeroes() : Observable<Hero[]>
  {
    // To catch errors, you "pipe" the observable result from http.get() through an RxJS catchError() operator.
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      // The getHeroes method taps into the flow of observable values and send a message, 
      // using the log() method, to the message area at the bottom of the page.

      // I see this tap() operator as something that squeezes itself inbetween what is happening in this http request,
      // and then just 'does something'.
      tap(_ => this.log("fetched heroes")),
      catchError(this.handleError<Hero[]>('getHeroes', []))
      // The catchError() operator intercepts an Observable that failed. The operator then passes the error to the error handling function (handleError).
      );
  }

  getHero(id : number) : Observable<Hero>
  {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  addHero(hero : Hero) : Observable<Hero>
  {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap( (newHero : Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>("addHero"))
    );
  }

  deleteHero(id : number) : Observable<Hero>
  {
    const url =`${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>("deletedHero"))
    );
  }

  searchHeroes(term : string) : Observable<Hero[]>
  {
    // if not term. (if there is no term, or it is empty)
    if(!term.trim())
    {
      return of( [] ); // return empty array.
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ? // ternary operator is used here, for one of the following text
        this.log(`found heroes matching "${term}"`) : 
        this.log(`no heroes matching ${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []) )
    );
  }



  private log(message : string)
  {
    this.messagesService.add(`HeroService: ${message}`);
  }

  updateHero(hero : Hero) : Observable<any>
  {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = "operation", result?: T)
  {
    return (error : any) : Observable<T> => 
    {
      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }

}
