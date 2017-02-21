var hits;
var misses;
var time;
var count;
var gameover;

//holds current pool of questions. to change each playthrough
var questions = [];

//question and answer format and trivia database
var queryPool = buildQuery();

//possible question building function
function addQuery(query, c1, c2, c3, c4) {
	return {
		question: query,
		choices: [c1,c2,c3,c4],
		answer: c1
	}
}

function buildQuery() {
	var array = []
	array.push(addQuery("Who is Cagliostro?",
		"The cutest alchemist",
		"An old man",
		"A smug snake",
		"A loli"));



	return array;
}

//main trivia game object
var trivia = {
	initialize: function() {
		hits = 0;
		misses = 0;
		count = 0;
		gameover = false;
	},

	//go to next question in 30 seconds
	timer: function() {
		time = setTimeout(function(){
		trivia.nextQuery();
		}, 1000 * 30);
	},

	clearTimer: function() {
		clearTimeout(time);
	}

	checkAnswer: function() {
		//if answer is correct, increase wins

		//if answer is wrong, increase misses

		//go to next question
		trivia.nextQuery();
	},


	nextQuery: function() {
		if (count == questions.length) {
			trivia.gameOver();
		}
		else {
			//display question and answers
			trivia.updateDisplay();
			//clear previous timer and start new one
			trivia.clearTimer();
			trivia.timer();
			//increase count
			count++;
		}
	},

	updateDisplay: function() {
		//update questions, choices, and timer

		//update results if gameover is true and ask if player wants to continue

		//if yes, initialize

	}

	//gameover sequence
	gameOver: function {
		gameover = true;
		game.updateDisplay();
	}
}

//get user choice from button pressed