const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config()
const gravatar = require('../utils/gravatar');

module.exports = {
    newNote: async (parent, args, {models}) => {
        return await models.Note.create({
            content: args.content,
            author: "abc"
        })
    },
    deleteNote: async (parent, args, {models}) => {
        try {
            await models.Note.findOneAndRemove({_id:args.id});
            return true;
        } catch (err) {
            return false;
        }
    },
    updateNote: async (parent, args, {models}) => {
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
    signUp: async (parent, args, { models }) => {
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
            console.log(process.env.JWT_SECRET);
            return jwt.sign({id:user._id}, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            throw new Error('Error creating account');
        }
        
    },
    signIn: async (parent, args, { models }) => {
        user = null
        if (args.email) {
            email = args.email.trim();
            user = await models.User.findOne({
                $or: [{email}]
            })
        }

        else if (args.username) {
            username = args.username.trim();
            user = await models.User.findOne({
                $or: [{username}]
            })
        }

        if (!user) {
            throw new AuthenticationError('Error signing in');
        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }

        console.log(process.env.JWT_SECRET);
        return jwt.sign({id:user._id}, process.env.JWT_SECRET);
    },
}

// 