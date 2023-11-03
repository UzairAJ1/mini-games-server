const { Scores } = require("../../models/Scores");
const {Games}=require("../../models/Games");
const {Users}=require("../../models/Users");

async function createScore(req,res)
{
    try {
        const { user_id, game_id, score } = req.body;
    
        // Check if the user and game exist
        const user = await Users.findOne({ user_id });
        const game = await Games.findOne({ game_id });
    
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
    
        if (!game) {
          return res.status(400).json({ message: 'Game not found' });
        }
    
        // Create a new score
        const newScore = new Scores({ user_id, game_id, score });
        await newScore.save();
        return res.status(201).json({ message: 'Score created successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

}

async function findHighestScore(req, res) {
    try {
      const { game_id } = req.body;
  
      if (!game_id) {
        return res.status(400).json({ message: 'game_id parameter is required' });
      }
  
      const highestScore = await Scores.findOne({ game_id }).sort({ score: -1 });
  
      if (!highestScore) {
        return res.status(404).json({ message: 'No scores found for the specified game_id' });
      }
  
      return res.status(200).json({
        user_id: highestScore.user_id,
        score: highestScore.score,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async function findScores(req,res)
  {
    try {
        const {user_id} = req.body;
    
        const user = await Users.findOne({ user_id });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Find scores for the user in all collections
        const userScores = await Scores.find({ user_id });
        const gameIdsAndScores = [];
    
        for (const score of userScores) {
          const game = await Games.findOne({ game_id: score.game_id });
    
          if (game) {
            gameIdsAndScores.push({
              game_id: game.game_id,
              score: score.score,
            });
          }
        }
    
        return res.status(200).json(gameIdsAndScores);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  }

  async function updateScore(req,res)
  {
    try {
        const user_id = req.params.userId
        const { game_id, score } = req.body;
    
        // Find the user based on the user_id
        const user = await Users.findOne({ userId: user_id });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Find the game based on game_id
        const game = await Games.findOne({ game_id });
    
        if (!game) {
          return res.status(404).json({ message: 'Game not found' });
        }
    
        // Find the existing score and update it
        const existingScore = await Scores.findOne({ user_id, game_id });
        
        if (!existingScore) {
          return res.status(404).json({ message: 'Score not found' });
        }
    
        existingScore.score = score;
        await existingScore.save();
    
        return res.status(200).json({ message: 'Score updated successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  }

module.exports={
    createScore,
    findHighestScore,
    findScores,
    updateScore
}