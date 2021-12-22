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
}