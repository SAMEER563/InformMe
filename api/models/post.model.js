import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: "https://tse2.mm.bing.net/th?id=OIP.YZ0HHRUiMohV03pwROoziQHaE8&pid=Api&P=0&h=180",
        },
        categories: {
            type: Array,
            default: 'uncategorised'
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },

    }, { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;