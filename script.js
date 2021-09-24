"use strict";
/*
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title}, by ${this.author}, ${this.pages} pages, and ${
      this.read ? "is not read yet" : "is already read"
    }.`;
  };
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
console.log(theHobbit.info());
// console.log(theHobbit.constructor);
*/

// disable drag behaviour
window.ondragstart = function () {
  return false;
};

// selector function
function $(x) {
  return document.getElementById(x);
}

const modalWindow = document.getElementById("form-container");
const btnNewBook = document.getElementById("icon-plus");
const btnCloseModal = document.getElementById("close-modal");

btnNewBook.addEventListener("click", () => {
  modalWindow.classList.remove("hidden");
});

btnCloseModal.addEventListener("click", () => {
  modalWindow.classList.add("hidden");
});

let myLibrary = [];

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = false;
}

function addBookToLibrary() {
  // do stuff here
}
