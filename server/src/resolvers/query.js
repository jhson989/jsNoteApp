module.exports =  {
    notes: async(parent, args, {models, user}) => {
        if (user == true)
            return await models.Note.find();
        else
            throw new Error("??");
    },
    note: async (parent, args, {models, user}) => {
        if (user == true)
            return models.Note.findById(args.id);
        else
            throw new Error("??");
    }
}