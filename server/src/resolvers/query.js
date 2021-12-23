module.exports =  {
    notes: async(parent, args, {models, user}) => {
        return await models.Note.find();
    },
    note: async (parent, args, {models, user}) => {
        return models.Note.findById(args.id);
    }
}