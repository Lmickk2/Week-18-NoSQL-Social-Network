const { Thought, User } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(thoughtData => res.json(thoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then(thoughtData => {
        if (!thoughtData) {
          res.status(404).json({ message: 'No Thought found with this id!' });
          return;
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400);
      });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought does not exist' })
          : Thought.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'Thought deleted',
            })
          : res.json({ message: 'Thought deleted!' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId}, 
      {$push: {reactions: body}}, 
      {new: true, runValidators: true})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(thoughtData => {
        if (!thoughtData) {
            res.status(404).json({message: 'No thought found with that ID.'});
            return;
        }
        res.json(thoughtData);
    })
    .catch(err => res.status(400).json(err))
},

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(thoughtData => {
        if (!thoughtData) {
          res.status(404).json({ message: 'No reaction found with that ID'});
          return;
        }
       res.json(thoughtData);
      })
      .catch(err => res.json(err));
  }

};
