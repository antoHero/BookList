//Book class that represents a book

	class Book {
		constructor(title, author, isbn) {
			this.title = title;
			this.author = author;
			this.isbn = isbn;
		}
	}

//UI class that handles UI tasks

	class UI {
		static displayBooks() {

			const books = Store.getBooks();

			books.forEach((book) => UI.addBookToList(book));
		}

		static addBookToList(book) {
			//create row to add to tbody
			const list = document.querySelector('#book-list');

			//create a table row
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${book.title}</td>
				<td>${book.author}</td>
				<td>${book.isbn}</td>
				<td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
			`;
			//append row to the list
			list.appendChild(row);
		}

		static deleteBook(el) {
			//el the target element
			if(el.classList.contains('delete')) {
				el.parentElement.parentElement.remove();
			}
		}

		static showAlert(message, className) {
			const div = document.createElement('div');
			div.className = `alert text-center alert-${className}`
			div.appendChild(document.createTextNode(message));
			const container = document.querySelector('.container');
			const form = document.querySelector('#book-form');
			container.insertBefore(div, form);

			//Make alert vanish in 3secs
			setTimeout(() => document.querySelector('.alert').remove(), 3000);
		}

		static clearFields() {
			document.querySelector('#title').value = '';
			document.querySelector('#author').value = '';
			document.querySelector('#isbn').value = '';
		}
	}
//Store class that handles storage
class Store {
	static getBooks() {
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if(book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem('books', JSON.stringify(books));
	}
 }

//Event to display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event to add a book

document.querySelector('#book-form').addEventListener('submit', (e) => {

	//prevent default action on submit

	e.preventDefault();

	//get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	//Validate form
	if(title === '' || author === '' || isbn === '') {
		UI.showAlert('Please fill in all fields', 'danger');
	} else {
		//instantiate book
		const book = new Book(title, author, isbn);

		//Add book to UI
		UI.addBookToList(book);

		//Add book to store
		Store.addBook(book);

		//Show success message

		UI.showAlert('Book successfully added', 'success');

		//Clear fields 
		UI.clearFields();
	}

	
});

//Event to remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
	//Remove book from UI
	UI.deleteBook(e.target);

	//Remove book from store
	Store.removeBook(e.target.parentElement.previousElementSibling.innerText);

	//Show success message after deletion

	UI.showAlert('Book Removed!', 'success');
});