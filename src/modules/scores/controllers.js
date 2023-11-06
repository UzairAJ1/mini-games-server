const {Scores}=require("../../models/Scores");
const {Games}=require("../../models/Games");
const {Users}=require("../../models/Users");

async function createScore(req,res)
{
    try {
        const { userName, game_id, score } = req.body;

        // Check if the user and game exist
        const user = await Users.findOne({ userName });
        const game = await Games.findOne({ game_id });

        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }

        if (!game) {
          return res.status(400).json({ message: 'Game not found' });
        }

        // Create a new score
        const newScore = new Scores({ userName, game_id, score });
        await newScore.save();
        return res.status(201).json({ message: 'Score created successfully', newScore: newScore });
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
        const {userName} = req.body;

        const user = await Users.findOne({ userName });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Find scores for the user in all collections
        const userScores = await Scores.find({ userName });
        const gameIdsAndScores = [];

        for (const score of userScores) {
          const game = await Games.findOne({ game_id: score.game_id });

          if (game) {
            gameIdsAndScores.push({game, score});
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
        const userName = req.params.userName
        const { game_id, score } = req.body;

        // Find the user based on the user_id
        const user = await Users.findOne({ userName });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Find the game based on game_id
        const game = await Games.findOne({ game_id });

        if (!game) {
          return res.status(404).json({ message: 'Game not found' });
        }

        // Find the existing score and update it
        const existingScore = await Scores.findOne({ userName, game_id });

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


  async function findScoresByGameId(req,res)
  {
    try {
        const {game_id} = req.body;

        const games = await Scores.find({ game_id }).sort({ score: -1 })

        const userScores = {};


        games.forEach((item) => {
            const userName = item.userName;
            const score = parseInt(item.score);

            if (!userScores[userName] || score > userScores[userName].score) {
                userScores[userName] = { score, item };
            }
        });

        return res.status(200).json({
          success:true,
          status:200,
          data:Object.values(userScores).map((entry) => entry.item)
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  }

module.exports={
    createScore,
    findHighestScore,
    findScores,
    updateScore,
    findScoresByGameId
}