import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createNote } from '../models/createNote';
import { Note } from '../models/model';
import { Login } from '../models/login';
import { Observable } from 'rxjs';
import { updateNote } from '../models/updateNote';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  createNote(note: createNote) {
    return this.http.post("http://localhost:3000/notes", note);
  }

  updateNote(note: createNote) {
    return this.http.put("http://localhost:3000/notes", note);
  }

  getNoteInfo(note: Note, user: Login): Observable<updateNote> {
    const params = new HttpParams()
      .set('username', user.username)
      .set('title', note.Title);
    return this.http.get<updateNote>("http://localhost:3000/notes",
      { params });
  }

  deleteNoteInfo(note: Note, user: Login) {
    if (confirm("Are you sure you want to proceed?")) {
      const params = new HttpParams()
        .set('username', user.username)
        .set('title', note.Title);
      return this.http.delete("http://localhost:3000/notes",
        { params });
    } else {
      const params = new HttpParams()
        .set('username', user.username)
        .set('title', note.Title);
      return this.http.get("http://localhost:3000/notes", { params });
    }
    
  }

  logout() {
    localStorage.clear();
  }
}
