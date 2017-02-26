var hits;
var misses;
var time; //internal timeout
var clock; //visible countdown
var countdown; //progress bar countdown
var maxTime;
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

	array.push(addQuery("In KonoSuba, what are the names of the main characters?",
		"Aqua, Kazuma, Megumin, and Darkness",
		"Kirito and Asuna",
		"Lina and Gourry",
		"Leonardo, Donatello, Raphael, and Michaelangelo",
		"konosuba.png"));

	array.push(addQuery("In Madoka Magica, what is the name of the creature that makes a contract with the girls?",
		"Kyubey",
		"Juubey",
		"Hachibey",
		"Sanbey",
		"madoka.jpg"));

	array.push(addQuery("Which of these is the basic model mech in Votoms?",
		"Scopedog",
		"Zaku",
		"Purple Bear",
		"Strong Bacchus",
		"votoms.jpg"));

	array.push(addQuery("What is the name of virtual youtuber for A.I. Channel?",
		"Kizuna Ai",
		"Hatsune Miku",
		"KAITO",
		"Yowane Haku",
		"ai_channel.png"))

	return array;
}

//main trivia game object
var trivia = {
	start: function() {
		var btn = $("<button>");
		$("#question").html("Press the button to start.");
		btn.attr("id", "start");
		btn.text("START");
		$("#choices").html(btn);
		$("#start").on("click", function(){
			trivia.initialize();
			trivia.nextQuery();
		});
	},

	initialize: function() {
		hits = 0;
		misses = 0;
		count = 0;
		maxTime = 30;
		countdown = maxTime;
		gameover = false;
		questions = [];
		trivia.randomize();
		$("#result").empty();
		$("#image").empty();
	},

	//go to next question in maxTime seconds
	timer: function() {
		time = setTimeout(function(){
		$("#choices").empty();
		$("#question").html("Time's up! It's " + questions[count].answer + "!")
		trivia.showImage();
		count++;
		misses++;
		trivia.pause();
		}, 1000 * (maxTime + 1) );
	},

	updateTimer: function() {
		clock = setInterval(function(){
			trivia.updateProgress();
			countdown = (countdown - 0.1).toFixed(1);
			//play sound when 10 sec or less remaining?
		}, 100);
	},

	clearTimer: function(t) {
		clearTimeout(t);
	},

	pause: function (){
		trivia.clearTimer(time);
		trivia.clearTimer(clock);
		var pause = setTimeout(function(){
			trivia.clearTimer(pause);
			trivia.nextQuery();
		}, 3000);
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
	},

	checkAnswer: function(ans) {
		var x = questions[count].answer;
		$("#choices").empty();
		//if answer is correct, increase hits
		if (ans == x) {
			hits++;
			$("#question").html("You're right! It's " + x + "!")
		}
		//if answer is wrong, increase misses
		else {
			misses++;
			$("#question").html("Sorry! It's " + x + "!")			
		}
		//go to next question
		trivia.showImage();
		trivia.pause();
		count++;
	},

	//display next question
	nextQuery: function() {
		if (count == questions.length) {
			trivia.clearTimer(time);
			trivia.clearTimer(clock);
			trivia.gameOver();
		}
		else {
			//clear previous timer
			trivia.clearTimer(time);
			trivia.clearTimer(clock);
			countdown = maxTime;
			//display question and answers
			trivia.updateDisplay();
			//start new timer
			trivia.updateTimer();
			trivia.timer();
		}
		$("#image").empty();
	},

	updateDisplay: function() {
		$("#choices").empty();
		if (gameover == false) {
			var curQuery = questions[count];
			var temp = [];
			var length = curQuery.choices.length;
			var rand;
			//update questions, choices, and timer
			$("#question").html("#" + (count + 1) + " " + curQuery.question);
			//list answers in random order
			for (var i = 0; i < length; i++) {
				rand = Math.floor(Math.random() * length);
				if (temp.includes(rand)) {
					i--;
				}
				else {
					temp.push(rand);
					var ans = curQuery.choices[rand];					
					var div = $("<div>");
					var btn = $("<button>");
					btn.addClass("btn btn-default");
					btn.attr("data-choice", ans);
					btn.attr("type","button");
					btn.text(ans);
					div.append(btn);
					$("#choices").append(div);
				}
			}
			//initial countdown display
			trivia.createProgress();
			countdown -= 0.1;
			trivia.press();
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
			$("#result").html("Hits: " + hits + " " + "Misses: " + misses);
			trivia.press();
		}

	},

	//create progress bar used as timer
	createProgress: function() {
		var div = $("<div>");
		div.addClass("progress");
		div.attr("id","ptimer");
		$("#progress").html(div);
		div = $("<div>");
		div.addClass("progress-bar progress-bar-success");
		div.attr("role","progressbar");
		div.attr("aria-valuenow", 100);
		div.attr("aria-valuemin", 0);
		div.attr("aria-valuemax", 100);
		div.css("width", "100%");
		$("#ptimer").html(div);
	},

	updateProgress: function () {
		var id = $(".progress-bar");
		var meter = Math.max(countdown / maxTime, 0) * 100;
		if (countdown == 10) {
			id.removeClass("progress-bar-warning");
			id.addClass("progress-bar-danger");
		}
		else if (countdown == 20) {
			id.removeClass("progress-bar-sucess");
			id.addClass("progress-bar-warning");
		}
		id.attr("aria-valuenow", meter);
		id.css("width", meter + "%" )
	},

	showImage: function() {
		var img = $("<img>");
		img.attr("src","assets/images/" + questions[count].image);
		$("#image").html(img);

	},

	//gameover sequence
	gameOver: function() {
		gameover = true;
		trivia.updateDisplay();
	},

	//detect clicks
	press: function () {
		$(".btn").on("click", function() {
			var value = $(this).attr("data-choice");
			if (gameover == false) {
				trivia.checkAnswer(value);
			}
			else {
				if (value == "Yes"){
					trivia.initialize();
					trivia.nextQuery();
				}
				else {
					//clear screen and thank player for playing
				}
			}
		});
	}
}

trivia.start();