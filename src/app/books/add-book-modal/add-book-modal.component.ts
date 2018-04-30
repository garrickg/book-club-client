import { User } from './../../shared/user.model';
import { BookService } from './../book.service';
import { Component, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal.component.html',
  styleUrls: ['./add-book-modal.component.css']
})
export class AddBookModalComponent {
  @Input() user: User;
  closeResult: string;
  private booksAPIUrl = 'https://www.googleapis.com/books/v1/volumes';
  private APIKey = 'AIzaSyDxZxGgriylWz3H02HfwFeVfFnGGkISvBc';
  bookSearchResults: any = [];
  searchComplete = false;
  selectedBook = null;
  selectedBookIndex = null;

  constructor(private modalService: NgbModal, private http: Http, private bookService: BookService) {}

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.reset();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getBooks(form: NgForm) {
    this.searchComplete = false;
    const { query } = form.value;
    this.http.get(`${this.booksAPIUrl}?q=${query}&key=${this.APIKey}`)
      .map((res: Response) => res.json())
      .subscribe(data => {
        const booksWithAuthors = data.items.filter(book => {
          return book.volumeInfo.authors && book.volumeInfo.imageLinks;
        })
        this.bookSearchResults = booksWithAuthors;
        this.searchComplete = true;
      });
  }

  onBookSelect(index) {
    this.selectedBookIndex = index;
    this.selectedBook = this.bookSearchResults[index];
  }

  async onSubmit () {
    await this.bookService.addBook(this.selectedBook);
    this.reset();
  }

  reset() {
    this.bookSearchResults = [];
    this.searchComplete = false;
    this.selectedBook = null;
    this.selectedBookIndex = null;
  }
}
