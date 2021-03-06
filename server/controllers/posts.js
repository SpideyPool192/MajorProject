import PostMessage from "../models/postMessages.js";
import FolderMessage from "../models/folderMessages.js";
import DiscussionComment from '../models/comments.js'
import Users from "../models/users.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(_id);
  res.json(post);
};

export const createPost = async (req, res) => {
  const post = req.body;
  const folder = new FolderMessage({ name: post.title });
  await folder.save();
  const discussionComment=new DiscussionComment({comment:"~root~"})
  await discussionComment.save();

  const newPost = new PostMessage({
    ...post,
    homeDirectory: folder._id,
    discussionForum: discussionComment._id,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    const user = await Users.findById(req.userId);
    user.createdPosts.push(newPost._id);
    const updatedUser = await Users.findByIdAndUpdate(req.userId, user, {
      new: true,
    });

    res.status(201).json({ newPost, updatedUser });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const _id = req.params.id;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatePost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  res.json(updatePost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const deletePost = await PostMessage.findByIdAndRemove(_id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const postId = req.params.id;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(postId);

  const user = await Users.findById(req.userId);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
    user.likedPosts.push(postId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
    user.likedPosts = user.likedPosts.filter((id) => id !== String(postId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(postId, post, {
    new: true,
  });
  const updatedUser = await Users.findByIdAndUpdate(req.userId, user, {
    new: true,
  });

  res.status(200).json({ updatedPost, updatedUser });
};

export const savePost = async (req, res) => {
  const postId = req.params.id;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(postId);

  const user = await Users.findById(req.userId);

  const index = post.saves.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.saves.push(req.userId);
    user.savedPosts.push(postId);
  } else {
    post.saves = post.saves.filter((id) => id !== String(req.userId));
    user.savedPosts = user.savedPosts.filter((id) => id !== String(postId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(postId, post, {
    new: true,
  });
  const updatedUser = await Users.findByIdAndUpdate(req.userId, user, {
    new: true,
  });

  res.status(200).json({ updatedPost, updatedUser });
};

export const viewPost = async (req, res) => {
  const postId = req.params.id;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(postId);

  const user = await Users.findById(req.userId);

  const index = post.views.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.views.push(req.userId);
    user.savedPosts.push(postId);
  }

  const updatedUser = await Users.findByIdAndUpdate(req.userId, user);
  const updatedPost = await PostMessage.findByIdAndUpdate(postId, post, {
    new: true,
  });

  res.status(200).json({ updatedPost, updatedUser });
};

export const SearchFun = async (req, res) => {
  var query = req.params.q;
  const searchparams = await PostMessage.find({
    title: { $regex: "^" + query },
  });
  res.status(200).json(searchparams);
};
