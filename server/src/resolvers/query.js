module.exports =  {
    notes: async(parent, args, {models, user}) => {
        return await models.Note.find();
    },
    note: async (parent, args, {models, user}) => {
        return models.Note.findById(args.id);
    },
    user: async (parent, args, {models, user}) => {
        const username = args.username;
        return await models.User.findOne({ username });
    },
    users: async (parent, args, {models, user}) => {
        return await models.User.find({});
    },
    me: async (parent, args, {models, user}) => {
        return await models.User.findById(user.id);
    }
}