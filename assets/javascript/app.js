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
console.log("Pool:" + queryPool);

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
		trivia.randomize();
		console.log("Iniliazed");
	},

	//go to next question in 30 seconds
	timer: function() {
		time = setTimeout(function(){
		trivia.nextQuery();
		console.log("Time's up");
		}, 1000 * 30);
	},

	clearTimer: function(t) {
		clearTimeout(t);
		console.log("Time cleared");
	},

	//randomize questions pool
	randomize: function() {
		var rand;
		var length = queryPool.length;
		var min = Math.min(length, 7);
		console.log("Randomized");

		for (var i = 0; i < min; i++) {
			rand = Math.floor(Math.random() * length);
			if (questions.includes(queryPool[rand])) {
				i--;
			}
			else {
				questions.push(queryPool[rand]);
			}
		}
	},

	checkAnswer: function(ans) {
		var x = questions[count].answer;
		var y = questions[count].choices[ans];
		console.log("answer: " + x);
		//if answer is correct, increase hits
		if (y == x) {
			hits++;
			console.log("win: " + hits);
		}
		//if answer is wrong, increase misses
		else {
			misses++;
			console.log("misses: " + misses);
		}

		//go to next question
		trivia.showImage();
		count++;
		trivia.nextQuery();
	},

	//display next question
	nextQuery: function() {
		if (count == questions.length) {
			trivia.clearTimer();
			trivia.gameOver();
		}
		else {
			//display question and answers
			trivia.updateDisplay();
			//clear previous timer and start new one
			trivia.clearTimer(time);
			trivia.timer();
			//increase count
			countdown = 30;
			console.log("next " + count);
		}
	},

	updateDisplay: function() {
		$("#choices").empty();
		if (gameover == false) {
			var curQuery = questions[count];
			//update questions, choices, and timer
			$("#question").html("#" + (count + 1) + " " + curQuery.question);
			//list answers
			for (var i = 0; i < curQuery.choices.length; i++) {
				var btn = $("<button>");
				btn.addClass("btn btn-default");
				btn.attr("data-choice", i);
				btn.attr("type","button");
				btn.text(curQuery.choices[i]);
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
	},

	showImage: function() {
		var img = $("<img>");
		img.attr("src","assets/images/" + questions[count].image);
		$("#image").html(img);
		console.log("image");
	},

	//gameover sequence
	gameOver: function() {
		gameover = true;
		trivia.updateDisplay();
		console.log("gameover");
	}
}

trivia.initialize();
trivia.nextQuery();

//add start sequence

//get user choice from button pressed
$(".btn").on("click", function() {
	var value = $(this).attr("data-choice");
	console.log("Value: " + value);
	trivia.checkAnswer(value);
	trivia.updateDisplay();
});