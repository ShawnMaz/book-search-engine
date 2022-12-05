import React, { useState} from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useMutation, useQuery } from '@apollo/client';
import {GET_ME} from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const {loading, data} = useQuery(GET_ME);
  const userSavedBooks = data?.savedBooks || []
  const [removeBook, {error}] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId_google) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await removeBook(
        {
          variables:{bookId:bookId_google}
        }
      )
      setUserData(data);
      // upon success, remove book's id from localStorage
      removeBookId(bookId_google);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userSavedBooks.length
            ? `Viewing ${userSavedBooks.length} saved ${userSavedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        {
          userSavedBooks && 
          <CardColumns>
            {userSavedBooks.map((book) => {
              return (
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                    {
                      error &&
                      <p className='small text-danger'>Unable to delete book. Something went wrong...</p>
                    }
                  </Card.Body>                  
                </Card>
              );
            })}
          </CardColumns>
        }
      </Container>
    </>
  );
};

export default SavedBooks;
