newGameResult = JSON.parse(localStorage.getItem('NEW_GAME_RESULT'))
bestGameResult = localStorage.getItem('BEST_GAME_RESULT')
  ? localStorage.getItem('BEST_GAME_RESULT')
  : 0

let newScore = 0

const newScoreDOM = document.getElementById('newScore')
const bestScoreDOM = document.getElementById('bestScore')
const clearDOM = document.getElementById('clear')

newScore =
  newGameResult.score + parseInt(newGameResult.remainingTime / 1000) * 1000
newScoreDOM.textContent = newScore
if (newScore > parseInt(bestGameResult)) {
  localStorage.setItem('BEST_GAME_RESULT', newScore)
  bestGameResult = newScore
}
bestScoreDOM.textContent = bestGameResult

clearDOM.addEventListener('click', () => {
  localStorage.removeItem('BEST_GAME_RESULT')
  bestScoreDOM.textContent = 0
})
