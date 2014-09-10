var $listener = $("#listener"),
    Quiz;

Quiz = function() {
  this.count = 4;
  this.questionCount = 3;
  this.user = {
    currentScore: [0,0,0,0],
    currentQuestion: 0,
    resultArray: [],
    answers: []
  };
  this.init();
};

Quiz.prototype.init = function() {
  this.listen();
};

Quiz.prototype.listen = function() {  
  var _this = this;

  $listener.on(":quiz/answer", function(e, data) {
    // expect a weighted array in the score key/value
    _this.updateUserScore(data.score);
    _this.user.answers.push(data.score);
    _this.user.currentQuestion++;
  });

  $listener.on(":quiz/updatestatus", function(e, data) {
    console.log(data);
  });

};

Quiz.prototype.updateUserScore = function(score) {
  var _this = this, newScore = this.user.currentScore;
  _.times(this.count, function(i) {
    newScore[i] += score[i];
  });
  this.user.currentScore = newScore;
  $listener.trigger(":quiz/updatestatus", "User's score has been updated");
};

Quiz.prototype.sortResults = function() {
  var diffs, finals;

  diffs = this.diffResults();
  finals = _.sortBy(diffs, function(r) {
    return Math.floor(r.distance)
  });

  this.user.resultArray = _.pluck(finals, "question");
};

Quiz.prototype.diffResults = function() {
  var _this = this,
      u = this.mapUserScore(),
      diffs = [];
  _.each(results, function(result, j) {

    var totalDifference = 0;
    
    _.times(_this.count, function(i) {
      totalDifference += Math.abs(result.weight[i] - u[i]);
    });

    diffs.push({
      question: j,
      distance: totalDifference
    });

  });

  return diffs;
};

Quiz.prototype.mapUserScore = function() {
  var _this = this,
      weightedScore = _.map(this.user.currentScore, function(score) {
    return score / _this.questionCount;
  });
  return weightedScore;
};

Quiz.prototype.displayResults = function() {
  this.sortResults();
  console.log(this.user.resultArray);
};

var q = new Quiz();

// proof
_.each(questions, function(q, i) {
  _.each(q.answers, function(a) {
    var x = {
      score: a.weight
    }
    $listener.trigger(":quiz/answer", x)
  });
});

q.displayResults();