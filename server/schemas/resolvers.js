const {User, Book} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query:{
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({_id:context.user._id})
                    .select('-__v -password');
                return userData;
            }
        }
    },
    Mutation:{
        login: async(parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user){
                throw new AuthenticationError('Invalid credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Invalid credentials');
            }

            const token = signToken(user);
            return {token, user};
        },
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async(parent, {input}, context) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    {_id:context.user._id},
                    {$push:{savedBooks:{...input}}},
                    {new:true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please login to save a book');
        }, 
        removeBook: async(parent, {bookId}, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$pull:{savedBooks:{bookId:bookId}}},
                    {new:true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please login to remove a saved book');
        }
    }
};

module.exports = resolvers;