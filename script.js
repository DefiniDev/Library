"use strict";
// disable drag behaviour
(function () {
  window.ondragstart = function () {
    return false;
  };

  // Selector function
  function $(x) {
    return document.getElementById(x);
  }

  // Check LocalStorage for library, if missing set empty array, otherwise get array from storage
  let myLibrary = [];
  if (JSON.parse(localStorage.getItem("library")) === null) {
    myLibrary = [];
    localStorage.setItem("library", JSON.stringify(myLibrary));
  } else {
    myLibrary = JSON.parse(localStorage.getItem("library"));
  }

  // UI creation, grid-responsiveness and array update functions
  const resetGridColumns = () => {
    let str;
    let contentWidth = myLibrary.length * 300 + myLibrary.length * 10;
    if (contentWidth < window.innerWidth && myLibrary.length < 6) {
      str = "1fr ".repeat(myLibrary.length);
    } else {
      const columnsNo = Math.floor(window.innerWidth / 320);
      str = "1fr ".repeat(columnsNo);
    }

    $("grid").setAttribute("style", `grid-template-columns: ${str}`);
  };

  window.onresize = resetGridColumns;

  const createSettingsIcon = id => {
    const btnSetting = document.createElement("div");
    btnSetting.classList.add("book-settings");
    btnSetting.setAttribute("id", `btn-settings-${id}`);
    return btnSetting;
  };

  const createBookCloseIcon = id => {
    const btnClose = document.createElement("div");
    btnClose.classList.add("close-window");
    btnClose.setAttribute("id", `btn-close-${id}`);
    btnClose.textContent = "X";
    return btnClose;
  };

  const createP = text => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(text));
    return p;
  };

  const createPInfo = text => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(text));
    p.classList.add("book-info");
    return p;
  };

  const createReadSlider = (checked, id) => {
    const input = document.createElement("input");
    input.setAttribute("id", id);
    input.type = "checkbox";
    checked ? (input.checked = true) : (input.checked = false);
    return input;
  };

  const clearModalInputs = () => {
    $("nb-title").value = "";
    $("nb-author").value = "";
    $("nb-pages").value = "";
    $("nb-read").checked = false;
  };

  const saveBook = i => {
    myLibrary[i]["title"] = $("nb-title").value;
    myLibrary[i]["author"] = $("nb-author").value;
    myLibrary[i]["pages"] = $("nb-pages").value;
    myLibrary[i]["read"] = $("nb-read").checked;
  };

  const updateForm = i => {
    $("nb-title").value = myLibrary[i]["title"];
    $("nb-author").value = myLibrary[i]["author"];
    $("nb-pages").value = myLibrary[i]["pages"];
    $("nb-read").checked = myLibrary[i]["read"];
    $("btn-savebook").value = "Save";
    $("form-container").classList.remove("hidden");
  };

  const clearBooks = () => {
    while ($("grid").firstChild) {
      $("grid").removeChild($("grid").firstChild);
    }
  };

  $("btn-newbook").addEventListener("click", () => {
    clearModalInputs();
    $("btn-savebook").removeEventListener("click", saveBook);
    $("btn-savebook").addEventListener("click", addBook);
    $("nb-read").checked = false;
    $("btn-savebook").value = "Add Book";
    $("form-container").classList.remove("hidden");
  });

  $("close-modal").addEventListener("click", () => {
    $("form-container").classList.add("hidden");
  });

  // Book object prototype
  function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  // Add book to Library
  const addBook = () => {
    if (
      $("nb-title").value === "" ||
      $("nb-author").value === "" ||
      $("nb-pages").value == ""
    ) {
      return;
    }
    const title = $("nb-title").value;
    const author = $("nb-author").value;
    const pages = $("nb-pages").value;
    const read = $("nb-read").checked;
    myLibrary.push(new Book(title, author, pages, read));
    localStorage.setItem("library", JSON.stringify(myLibrary));
    clearBooks();
    displayBooks();
  };

  // Display books, arrange UI, update array
  function displayBooks() {
    clearBooks();
    for (let i = 0; i < myLibrary.length; i++) {
      resetGridColumns();
      window["book" + i] = document.createElement("div");
      window["book" + i].classList.add("book");
      window["book" + i].classList.add("book" + i);
      window["book" + i].appendChild(createSettingsIcon(i));
      window["book" + i].appendChild(createBookCloseIcon(i));
      window["book" + i].appendChild(createP("Title:"));
      window["book" + i].appendChild(createPInfo(myLibrary[i]["title"]));
      window["book" + i].appendChild(createP("Author:"));
      window["book" + i].appendChild(createPInfo(myLibrary[i]["author"]));
      window["book" + i].appendChild(createP("Pages:"));
      window["book" + i].appendChild(createPInfo(myLibrary[i]["pages"]));
      window["book" + i].appendChild(createP("Read?"));
      window["book" + i].appendChild(
        createReadSlider(myLibrary[i]["read"], `btn-slider-${i}`)
      );
      $("grid").appendChild(window["book" + i]);

      // Book-card buttons functions
      $(`btn-settings-${i}`).addEventListener("click", () => {
        $("btn-savebook").removeEventListener("click", addBook);
        const updateBook = () => {
          saveBook(i);
          updateForm(i);
          localStorage.setItem("library", JSON.stringify(myLibrary));
          displayBooks();
          $("form-container").classList.add("hidden");
          $("btn-savebook").removeEventListener("click", updateBook);
        };
        updateForm(i);
        $("btn-savebook").addEventListener("click", updateBook);
      });

      $(`btn-close-${i}`).addEventListener("click", () => {
        window["book" + i].classList.add("hidden");
        setTimeout(function () {
          myLibrary.splice(i, 1);
          // Delete LocalStorage Library cache if no remaining books
          if (myLibrary.length === 0) {
            localStorage.clear("library");
            displayBooks();
          } else {
            localStorage.setItem("library", JSON.stringify(myLibrary));
            displayBooks();
          }
        }, 600);
      });
      $(`btn-slider-${i}`).addEventListener("click", () => {
        myLibrary[i]["read"] === true
          ? (myLibrary[i]["read"] = false)
          : (myLibrary[i]["read"] = true);
        localStorage.setItem("library", JSON.stringify(myLibrary));
      });
    }
  }

  // Display intial array
  displayBooks();
})();
