import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email:String!, $password:String!){
        login(email:$email, password:$password){
            token
            user{
                _id
                username
            }
        }        
    }
`;

export const ADD_USER = gql`
    mutation addUser($username:String!, $email:String!, $password:String!){
        addUser(username:$username, email:$email, password:$password){
            token
            user{
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookId:String!, $authours:[String!], $description:String!, $title:String!, $image:String!, $link:String!){
        saveBook(input:{
            bookId:$bookId,
            authours:$authours,
            description:$description,
            title:$title,
            image:$image,
            link:$link
        }){
            _id
            username
            email
            bookCount
            savedBooks{
                bookId
                authours
                description
                title
                image
                link
            }
        }
    }
`;
