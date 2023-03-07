const STORAGE_KEY = "BOOKS_APP"

const title = document.querySelector("#inputBookTitle")
const sectionTitle = document.querySelector("#sectionTitle")

const author = document.querySelector("#inputBookAuthor")
const sectionAuthor = document.querySelector("#sectionAuthor")

const year = document.querySelector("#inputBookYear")
const sectionYear = document.querySelector("#sectionYear")

const readed = document.querySelector("#inputBookIsComplete")

const btnSubmit = document.querySelector("#bookSubmit")

let checkInput = []
let checkTitle = null
let checkAuthor = null
let checkYear = null

function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

window.addEventListener("load", function(){
    if (localStorage.getItem(STORAGE_KEY) !== null) {    
        const booksData = getData()
        showData(booksData)
    }
})

function insertData(book) {
    let bookData = []

    if (localStorage.getItem(STORAGE_KEY) === null) {
        localStorage.setItem(STORAGE_KEY, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(STORAGE_KEY))
    }

    bookData.unshift(book)   
    localStorage.setItem(STORAGE_KEY,JSON.stringify(bookData))

    showData(getData())
}

function validation(check) {
    let resultCheck = []
    
    check.forEach((a,i) => {
        if (a == false) {
            if (i == 0) {
                resultCheck.push(false)
            }else if (i == 1) {
                resultCheck.push(false)
            }else{
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
}

btnSubmit.addEventListener("click", function() {
    if (btnSubmit.value == "") {
        checkInput = []

        checkInput.push(checkTitle,checkAuthor,checkYear)
        let resultCheck = validation(checkInput)

        if (resultCheck.includes(false)) {
            return false
        }else{
            const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                isCompleted: readed.checked
            }
            insertData(newBook)

            title.value = ''
            author.value = ''
            year.value = ''
            readed.checked = false
        }    
    }else{
        const bookData = getData().filter(a => a.id != btnSubmit.value);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(bookData))

        const newBook = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            isCompleted: readed.checked
        }
        insertData(newBook)
        btnSubmit.innerHTML = "Masukkan Buku ke Rak <span>Belum selesai dibaca</span>"
        btnSubmit.value = ''
        title.value = ''
        author.value = ''
        year.value = ''
        readed.checked = false
        alert("Data buku berhasil diedit")
    }
})

function readedBook(id) {
    let confirmation = confirm("Pindahkan buku ke rak selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: true
        }

        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(bookData))

        insertData(newBook)
    }else{
        return 0
    }
}

function unreadedBook(id) {
    let confirmation = confirm("Pindahkan buku ke rak belum selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: false
        }

        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(bookData))

        insertData(newBook)
    }else{
        return 0
    }
}

function editBook(id) {
    const bookDataDetail = getData().filter(a => a.id == id);
    title.value = bookDataDetail[0].title
    author.value = bookDataDetail[0].author
    year.value = bookDataDetail[0].year
    bookDataDetail[0].isCompleted ? readed.checked = true:readed.checked = false

    btnSubmit.innerHTML = "Edit data buku"
    btnSubmit.value = bookDataDetail[0].id
}

function deleteBook(id) {
    let confirmation = confirm("Akan menghapus data buku?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(bookData))
        showData(getData())
        alert(`Data buku "${bookDataDetail[0].title}" telah terhapus`)
    }else{
        return 0
    }
}

function showData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = 
            `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                    <button class="orange" onclick="editBook('${book.id}')">Edit Buku</button>
                </div>
            </article>
            <p></p>
            `
            inCompleted.innerHTML += el
        }else{
            let el = 
            `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai dibaca</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                    <button class="orange" onclick="editBook('${book.id}')">Edit Buku</button>
                </div>
            </article>
            <p></p>
            `
            completed.innerHTML += el
        }
    });
}

