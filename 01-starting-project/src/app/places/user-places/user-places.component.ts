import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private httpClient= inject(HttpClient);
  private destroyRef=inject(DestroyRef);
  ngOnInit(){
      const subscription=this.httpClient.get<{places:Place[]}>
      ('http://localhost:3000/user-places')
      .pipe(
        map((resData)=>resData.places)
      )
      .subscribe({
        next:(places)=>{
          this.places.set(places);
        },
      });
  
      this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      })
        
    }
}
