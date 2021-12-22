module.exports =  {
    notes: async(parent, args, {models}) => {
        return await models.Note.find();
    },
    note: async (parent, args, {models}) => {
        return models.Note.findById(args.id);
    }
}