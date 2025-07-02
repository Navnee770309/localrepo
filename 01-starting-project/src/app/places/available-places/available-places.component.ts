import { Component, signal,inject, DestroyRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient= inject(HttpClient);
  private destroyRef=inject(DestroyRef);
  ngOnInit(){
    const subscription=this.httpClient.get<{places:Place[]}>
    ('http://localhost:3000/places')
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
  onSelectedPlace(selectedPlace:Place){
    this.httpClient
    .put('http://localhost:3000/user-places',{
      placeId:selectedPlace.id,
    })
    .subscribe({
      next:(resData)=>console.log(resData),
    })
  }
  removeUserPlace(place:Place){
    const prevPlaces=this.onSelectedPlace(place);
    if(prevPlaces.some((p)=>p.id===place.id)){

    }
    return this.httpClient
    .delete('http://localhost:/3000/user-places/'+place.id)

  }


}
