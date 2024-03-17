// const serverUrl = 'http://localhost:9000/api';
const serverUrl = 'https://space-invaders-3d.vercel.app/api';

export const getScores = async () => {
  // const serverUrl = 'https://space-invaders-3d.vercel.app/api';
  try {
    const response = await fetch(`${serverUrl}/score`);
    const scoresData = await response.json();
    if (response.ok) {
      return scoresData;
    } else {
      console.error('Failed to fetch scores:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
  return [];
};

// Get the high score from server
export const getHighScore = async () => {
  // const serverUrl = 'https://space-invaders-3d.vercel.app/api';

  try {
    const response = await fetch(`${serverUrl}/getHighestScore`);
    const highestScoreData = await response.json();

    if (response.ok) {
      return highestScoreData;
    } else {
      console.error('Failed to fetch highest score:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching highest score:', error);
  }
};
// Post new score to server
export const postScore = async (scoreData) => {
  // const serverUrl = 'https://space-invaders-3d.vercel.app/api';
  try {
    const response = await fetch(`${serverUrl}/submitScore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });

    if (response) return response;
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};
