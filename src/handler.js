const { nanoid } = require('nanoid');
const books = require('./books');

const welcomeHandler = (request, h) => h.response('Hai, selamat datang!').code(200);

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name || name === '' || name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const isFinished = (pageCountt, readPagee) => {
    if (pageCountt === readPagee) {
      return true;
    }
    return false;
  };
  const finished = isFinished(pageCount, readPage);

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const lowName = name.toLowerCase();

    const filteredBooks = books
      .filter((n) => n.name.toLowerCase() === lowName.toLowerCase())
      .map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      }));

    if (filteredBooks.length < 1) {
      const response = h.response({
        status: 'success',
        data: {
          books: [],
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const filteredBooks = books
      .filter((r) => Number(r.reading) === reading)
      .map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      }));

    if (filteredBooks.length < 1) {
      const response = h.response({
        status: 'success',
        data: {
          books: [],
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const filteredBooks = books
      .filter((f) => Number(f.finished) === finished)
      .map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      }));

    if (filteredBooks.length < 1) {
      const response = h.response({
        status: 'success',
        data: {
          books: [],
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    response.code(200);
    return response;
  }

  if (books.length < 1) {
    const response = h.response({
      status: 'success',
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (name === undefined || name === '') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  welcomeHandler,
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
