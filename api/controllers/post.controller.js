// /controllers/post.controller.js
import fs from 'fs/promises';
import path from 'path';
import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

const DEFAULT_IMAGE =
  'https://images.static-collegedunia.com/public/college_data/images/campusimage/151937286431.JPG';

function buildImageUrl(req, filename) {
  if (!filename) return DEFAULT_IMAGE;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${filename}`;
}

export const create = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const slug = req.body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const imageUrl = req.file ? buildImageUrl(req, req.file.filename) : req.body.image || DEFAULT_IMAGE;

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
      image: imageUrl,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

async function removeFileIfExists(imageUrl) {
  if (!imageUrl) return;
  // Only remove local uploads; ignore default remote image URLs
  // Accepts formats:
  //  - '/uploads/filename.jpg'
  //  - 'http://host/uploads/filename.jpg' or 'https://host/uploads/filename.jpg'
  try {
    const uploadsSegment = '/uploads/';
    let filename = null;

    if (imageUrl.startsWith(uploadsSegment)) {
      // '/uploads/filename.jpg'
      filename = imageUrl.split(uploadsSegment)[1];
    } else if (imageUrl.includes(uploadsSegment)) {
      // 'http(s)://host/uploads/filename.jpg'
      filename = imageUrl.split(uploadsSegment)[1];
    }

    if (!filename) return;

    const filePath = path.join(process.cwd(), 'uploads', filename);
    await fs.unlink(filePath);
  } catch (err) {
    // ignore missing file or unlink errors
  }
}

export const deletepost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found'));

    // remove associated uploaded image if it's local
    await removeFileIfExists(post.image);

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: 'The post has been deleted' });
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found'));

    // If a new file was uploaded, delete previous local file (if any) and set new image url
    if (req.file) {
      await removeFileIfExists(post.image);
    }

    const updatedData = {
      title: req.body.title ?? post.title,
      content: req.body.content ?? post.content,
      category: req.body.category ?? post.category,
      image: req.file ? buildImageUrl(req, req.file.filename) : req.body.image ?? post.image,
    };

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, { $set: updatedData }, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
