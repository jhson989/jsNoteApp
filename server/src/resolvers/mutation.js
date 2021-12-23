const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config()
const gravatar = require('../utils/gravatar');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');

module.exports = {
    newNote: async (parent, args, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to create a note.');
        }

        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id)
        })
    },
    deleteNote: async (parent, args, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note.');
        }

        const note = models.Note.findById(args.id);

        if (note && String(note.authore) !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the note.");
        }

        try {
            await note.remove();
            return true;
        } catch (err) {
            return false;
        }
    },
    updateNote: async (parent, args, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note.');

        }

        const note = models.Note.findById(args.id);

        if (note && String(note.authore) !== user.id) {
            throw new ForbiddenError("You don't have permissions to update the note.");
        }
        return await models.Note.findOneAndUpdate(
            {
                _id: args.id,
            },
            {
                $set: {
                    content: args.content
                }
            },
            {
                new: true
            }
        )
    },
    signUp: async (parent, args, { models, user }) => {
        username = args.username;
        email = args.email.trim();
        const hashed = await bcrypt.hash(args.password, 10);
        const avatar = gravatar(email);

        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });
            return jwt.sign({id:user._id}, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            throw new Error('Error creating account');
        }
        
    },
    signIn: async (parent, args, { models, user }) => {
        item = null
        if (args.email) {
            email = args.email.trim();
            item = await models.User.findOne({
                $or: [{email}]
            })
        }

        else if (args.username) {
            username = args.username.trim();
            item = await models.User.findOne({
                $or: [{username}]
            })
        }

        if (!item) {
            throw new AuthenticationError('Error signing in');
        }

        const valid = await bcrypt.compare(args.password, item.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }

        return jwt.sign({id:item._id}, process.env.JWT_SECRET);
    },
    toggleFavorite: async (parent, args, { models, user }) => {
        
        if (!user) {
            throw new AuthenticationError('You must be signed in.');
        }

        let noteCheck = await models.Note.findById(args.id);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);

        if (hasUser >= 0) {
            return await models.Note.findByIdAndUpdate(
                args.id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true
                }
            );
        } else {
            return await models.Note.findByIdAndUpdate(
                args.id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },  
                {
                    new: true
                }
            );
        }
    }
}

// 