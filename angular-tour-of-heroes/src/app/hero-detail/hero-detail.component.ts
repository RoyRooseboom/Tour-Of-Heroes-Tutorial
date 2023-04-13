import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent 
{
  // ( | undefined ) means potentially be undefined. So that it is allowed to be undefined
  hero : Hero | undefined;


  constructor(
    private route : ActivatedRoute,
    private heroService : HeroService,
    private location : Location
  ){}

  ngOnInit() : void
  {
    this.getHero();
  }

  getHero() : void
  {
    // Takes the id out of the url
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack() : void
  {
    // Goes back to the last screen you came from.
    this.location.back();
  }

  save() : void
  {
    if(this.hero)
    {
      this.heroService.updateHero(this.hero).subscribe( () => this.goBack() );
    }
  }

  
}
