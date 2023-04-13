import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit
{
  // The $ sign is just a naming convention for observables, you do not have to put it in the name
  // The ! (definite assignment assertion modifier) relays to TypeScript that a variable is indeed assigned for all intents and purposes.
  // When a property is initialized indirectly, the program might think it is 'undefined' or 'unintialized', with the '!' operator we tell the
  // program that we are sure, that the property is definitly assigned.
  heroes$! : Observable<Hero[]>;


  // A Subject is both a source of observable values and an Observable itself. You can subscribe to a Subject as you would any Observable.
  private searchTerms = new Subject<string>();

  constructor(private heroService : HeroService) {}

  search(term : string) : void
  {
    this.searchTerms.next(term);
  }

  ngOnInit() : void 
  {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap( (term:string) => this.heroService.searchHeroes(term))
    );
  }
}
