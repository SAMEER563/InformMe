
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://images.static-collegedunia.com/public/college_data/images/campusimage/151937286431.JPG',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    // course: {
    //   type: String,
    //   default: 'uncategorized',
    // },
    // branch: {
    //   type: String,
    //   default: 'uncategorized',
    // },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
