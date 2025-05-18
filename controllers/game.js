const Game = require("../models/game");

exports.listGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.render('games/list', { games });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

exports.showGameForm = (req, res) => {
  res.render('games/new');
};

exports.createGame = async (req, res) => {
  try {
    const game = new Game({ gameName: req.body.gameName });
    await game.save();
    res.redirect('/games');
  } catch (error) {
    console.log(error);
    res.redirect('/games/new');
  }
};

exports.showGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    const groups = await Group.find({ game: req.params.id }).populate('game');
    res.render('games/show', { game, groups });
  } catch (error) {
    console.log(error);
    res.redirect('/games');
  }
};

exports.deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    // Groups will remain but their game reference will be dangling
    res.redirect('/games');
  } catch (error) {
    console.log(error);
    res.redirect(`/games/${req.params.id}`);
  }
};