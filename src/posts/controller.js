const Post = require("./model");
const { InvalidArgumentError, InternalServerError } = require("../errors");

module.exports = {
  async add(req, res) {
    try {
      const post = new Post(req.body);
      await post.add();

      res.status(201).send(post);
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        res.status(422).json({ error: error.message });
      } else if (error instanceof InternalServerError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async list(req, res) {
    try {
      const posts = await Post.list();
      res.send(posts);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },

  async getPostDetails(req, res) {
    try {
      const post = await Post.findById(req.params.id, req.user.id);
      res.json(post);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const post = await Post.findById(req.params.id, req.user.id);
      post.remover();
      res.status(204);
      res.end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
