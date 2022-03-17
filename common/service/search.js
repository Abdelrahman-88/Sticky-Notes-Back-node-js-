module.exports = async(search, key, value, limit, skip, model, fields, populate, select) => {
    let data, total, totalPages

    if (search) {
        const queries = fields.map((i) => {
            return {
                [i]: { $regex: search }
            };
        });
        data = await model.find({
            [key]: value,
            $or: queries
        }).populate(populate).select(select).skip(skip).limit(parseInt(limit))
        total = await model.find({
            [key]: value,
            $or: queries
        }).populate(populate).select(select).count()
        totalPages = Math.ceil(total / limit)
    } else {
        data = await model.find({
            [key]: value
        }).populate(populate, select).skip(skip).limit(parseInt(limit))
        total = await model.find({
            [key]: value
        }).populate(populate, select).count()
        totalPages = Math.ceil(total / limit)
    }
    return { data, total, totalPages }
}