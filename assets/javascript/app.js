var hits;
var misses;
var time;
var countdown;
var count;
var gameover;

//holds current pool of questions. to change each playthrough
var questions = [];

//question and answer format and trivia database
var queryPool = buildQuery();

//possible question building function
function addQuery(query, c1, c2, c3, c4, image) {
	return {
		question: query,
		choices: [c1,c2,c3,c4],
		answer: c1,
		image: image
	}
}

function buildQuery() {
	var array = []

	array.push(addQuery("Who is Cagliostro?",
		"The cutest alchemist",
		"An old man",
		"A smug snake",
		"A loli",
		""));

	array.push(addQuery("What does Goblin Mage like?",
		"Shiny things",
		"Rocks",
		"Animals",
		"Magic",
		""));

	return array;
}

//main trivia game object
var trivia = {
	initialize: function() {
		hits = 0;
		misses = 0;
		count = 0;
		countdown = 30;
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
	},

	//randomize questions pool
	randomize: function() {
		var rand;
		var length = queryPool.length;
		var min = Math.min(length, 7);

		for (var i = 0; i < min; i++) {
			rand = Math.floor(Math.random() * length);
			if (questions.includes(queryPool[rand])) {
				i--;
			}
			else {
				questions.push(queryPool[rand]);
			}
		}
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
			countdown = 30;
		}
	},

	updateDisplay: function() {
		if (gameover == false) {
			var curQuery = questions[count];
			//update questions, choices, and timer
			$("#question").html("#" + count + " " + curQuery);
			for (var i = 0; i < curQuery.choices.length; i++) {
				var btn = $("<button>");
				btn.attr("data-choice", count + 1);
				btn.attr("type","button");
				btn.addClass("btn btn-default");
				btn.text(curQuery);
				$("#choices").append(btn);
			}
			trivia.updateTimer();
		}
		//update results if gameover is true and ask if player wants to continue
		else {
			$("#question").html("Continue?");
			for (var i = 0; i < 2; i++) {
				var array = ["Yes", "No"];
				var btn = $("<button>");
				btn.attr("data-choice", array[i]);
				btn.attr("type","button");
				btn.addClass("btn btn-default");
				btn.text(array[i]);
				$("#choices").append(btn);
			}
		}
		//if yes, initialize

	},

	updateTimer: function() {
		setInterval(function(){
			$("#timer").html(countdown + " sec");
			countdown--;
			//play sound when 10 sec or less remaining?
		}, 1000);
	}

	showImage: function() {
		var img = $("<img>");
		img.attr("src","assets/images/" + questions[count].image);
		$("#result").html(img);
	}

	//gameover sequence
	gameOver: function {
		gameover = true;
		game.updateDisplay();
	}
}

//get user choice from button pressed