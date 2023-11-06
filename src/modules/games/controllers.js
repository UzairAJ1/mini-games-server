const { Games } = require("../../models/Games");

async function createGame(req, res) {
  try {
    const { game_name, game_id, datetime_start, datetime_end, prize_name, prize_image, prize_url } = req.body;

    // Check if game_name and game_id are provided
    if (!game_name || !game_id) {
      return res.status(400).json({ message: 'game_name and game_id are mandatory fields' });
    }

    // Check if the game_id is already taken
    const existingGame = await Games.findOne({ game_id });
    if (existingGame) {
      return res.status(400).json({ message: 'ID is already taken' });
    }

    // Create a new game
    const gameData = { game_name, game_id };

    // Add optional fields if they exist
    if (datetime_start) gameData.datetime_start = datetime_start;
    if (datetime_end) gameData.datetime_end = datetime_end;
    if (prize_name) gameData.prize_name = prize_name;
    if (prize_image) gameData.prize_image = prize_image;
    if (prize_url) gameData.prize_url = prize_url;

    const game = new Games(gameData);
    await game.save();
    return res.status(201).json({ message: 'Game registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


async function findGame(req, res) {
  try {
    const { game_id } = req.body;

    // Find the game by game_id
    const game = await Games.findOne({ game_id });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function findAllGames(req, res) {
  try {
    // Find all games in the database and sort them by game_id as numbers in ascending order
    const games = await Games.find().sort({ game_id: 1 }).lean();

    if (!games || games.length === 0) {
      return res.status(404).json({ message: 'No games found in the database' });
    }

    // Convert game_id to numbers for sorting
    games.forEach((game) => {
      game.game_id = parseInt(game.game_id);
    });

    // Sort the games after converting game_id to numbers
    games.sort((a, b) => a.game_id - b.game_id);

    return res.status(200).json(games);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}




module.exports={
    createGame,
    findGame,
    findAllGames
}