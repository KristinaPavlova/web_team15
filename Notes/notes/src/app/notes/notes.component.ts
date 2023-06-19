import { Component } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
import { Login } from '../models/login';
import { Note } from '../models/model';
import { createNote } from '../models/createNote';
import { NotesService } from '../service/notes.service';
import { updateNote } from '../models/updateNote';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {

  user: Login = {
    username: '',
    password: ''
  }

  notes: Note[] = [];
  createNote: createNote = {
    title: '',
    content: '',
    username: '',
    created: '',
    last_modified: ''
  };

  updateNote: updateNote = {
    Title: '',
    Content: '',
    Creation_Date: '',
    Last_Modified_Date: ''
  };

  noteToEdit: createNote = {
    title: '',
    content: '',
    username: '',
    created: '',
    last_modified: ''
  };

  constructor(private infoService: AuthServiceService,
    private router: Router,
    private storage: LocalStorageService,
    private noteService: NotesService) { }

  ngOnInit(): void {
    this.loadInfo();
  }

  loadInfo(): void {
    this.user = this.storage.getUser();
    this.infoService.login(this.user).subscribe({
      next: (res) => { this.notes = res; console.log(this.notes) },
      error: err => { }
    })
  }

  crateNote(): void {
    const currentDateTime: Date = new Date();
    const formattedDateTime: string = currentDateTime.toISOString();
    this.createNote.username = this.user.username;
    this.createNote.created = formattedDateTime;
    this.createNote.last_modified = formattedDateTime;
    this.noteService.createNote(this.createNote).subscribe({
      next: (res) => { window.location.reload(); },
      error: err => { 
        alert("You allredy hava a note with this title.");
      }
    })
  }

  openEditNote(note: Note): void {
    console.log("here");
    this.noteService.getNoteInfo(note, this.user).subscribe({
      next: (res) => {
        this.updateNote = res;

        const editNoteWindow = document.getElementById('container-modal');
        editNoteWindow!.style.display = 'block';
        editNoteWindow!.setAttribute('data', note.Creation_Date);

        let showDate = document.getElementById('dateEditForm') as HTMLParagraphElement;
        showDate!.innerText = this.updateNote.Creation_Date.substring(0,10) + " "+ this.updateNote.Creation_Date.substring(11,16);

        let editNoteContentName = document.getElementById('note-content-name') as HTMLTextAreaElement;
        console.log(editNoteContentName);
        let editNoteContentText = document.getElementById('note-content-text') as HTMLTextAreaElement;

        editNoteContentName!.value = this.updateNote.Title;
        editNoteContentText!.value = this.updateNote.Content;
        console.log(editNoteContentName);
        console.log(this.updateNote);
      },
      error: err => { }
    });


  }

  editNote(): void {
    const editNoteWindow = document.getElementById('container-modal');
    let editNoteContentName = document.getElementById('note-content-name') as HTMLTextAreaElement;
    let editNoteContentText = document.getElementById('note-content-text') as HTMLTextAreaElement;
    const currentDateTime: Date = new Date();
    const formattedDateTime: string = currentDateTime.toISOString();

    this.noteToEdit.title = editNoteContentName.value;
    this.noteToEdit.content = editNoteContentText.value;
    this.noteToEdit.created = editNoteWindow!.getAttribute("data")!;
    this.noteToEdit.last_modified = formattedDateTime;
    this.noteToEdit.username = this.storage.getUsername();
    console.log('from here');
    console.log(this.noteToEdit);

    this.noteService.updateNote(this.noteToEdit).subscribe({
      next: (res) => { window.location.reload(); },
      error: err => { }
    })

  }


  deleteNode(note: Note): void {
    this.noteService.deleteNoteInfo(note, this.user).subscribe({
      next: (res) => { window.location.reload(); },
      error: err => {
        alert("Something wen wrog, sorry!");
       }
    })
  }

  closeEditNote():void {
    const editNoteWindow = document.getElementById('container-modal');
    editNoteWindow!.style.display = 'none';
  }

  logOut(): void{
    this.noteService.logout();
    this.router.navigate(['/login']);
}
}
