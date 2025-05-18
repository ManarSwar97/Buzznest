
const express = require("express")
const router = express.Router()


const Group = require('../models/groups');
const Game = require('../models/game');



router.index = async (req, res) => {
    try {
        const games = await Game.find().lean();
        const gamesWithGroups = await Promise.all(games.map(async game => {
            const groups = await Group.find({ game: game._id });
            return { ...game, groups };
        }));
        res.render('groups/index', { gamesWithGroups });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

router.showGroupForm = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    res.render('groups/new', { game });
  } catch (error) {
    console.log(error);
    res.redirect(`/games/${req.params.gameId}`);
  }
};

router.createGroup = async (req, res) => {
  try {
    const group = new Group({
      groupName: req.body.groupName,
      game: req.params.gameId
    });
    await group.save();
    res.redirect(`/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/games/${req.params.gameId}/groups/new`);
  }
};

router.deleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.redirect(`/games/${req.params.gameId}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/games/${req.params.gameId}`);
  }
};

module.exports = router;