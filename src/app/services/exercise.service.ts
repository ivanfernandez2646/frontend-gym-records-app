import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exercise } from '../models/exercise.model';
import { CRUDAction } from '../utils/GenericUtils';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private apiRoute = environment.apiUrl;
  private exercises: Exercise[];

  public exercises$: ReplaySubject<Exercise[]> = new ReplaySubject(1);
  public exercisesAction$: ReplaySubject<CRUDAction> = new ReplaySubject(1);

  constructor(private httpClient: HttpClient) {}

  loadExercises(): void {
    this.httpClient
      .get<Exercise[]>(`${this.apiRoute}/exercise`)
      .subscribe((res) => {
        this.exercises = res;
        this.exercises$.next(this.exercises);
      });
  }

  create(exercise: Exercise): void {
    this.httpClient
      .post<Exercise>(`${this.apiRoute}/exercise`, exercise)
      .subscribe((res) => {
        this.exercises.push(res);
        this.exercises$.next(this.exercises);
        this.exercisesAction$.next(CRUDAction.CREATE);
      });
  }

  update(id: string, exercise: Exercise) {
    this.httpClient
      .put<Exercise>(`${this.apiRoute}/exercise/${id}`, exercise)
      .subscribe((res) => {
        const index = this.exercises.findIndex((e) => e._id === id);
        this.exercises.splice(index, 1, res);
        this.exercises$.next(this.exercises);
        this.exercisesAction$.next(CRUDAction.UPDATE);
      });
  }

  delete(id: string): void {
    this.httpClient
      .delete<boolean>(`${this.apiRoute}/exercise/${id}`)
      .subscribe(() => {
        const index = this.exercises.findIndex((e) => e._id === id);
        this.exercises.splice(index, 1);
        this.exercises$.next(this.exercises);
        this.exercisesAction$.next(CRUDAction.DELETE);
      });
  }
}
