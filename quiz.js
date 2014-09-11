"use strict";

var $listener = $listener || $("#listener"),
    Quiz;

Quiz = function(args) {
  
  this.config = {
    criteriaCount: 4,
    questions: [],
    results: []
  };
  
  $.extend(this.config, args);

  this.state = {
    currentScore: [0,0,0,0],
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
    _this.updateUserScore(data.weight);
  });

  $listener.on(":quiz/updatestatus", function(e, data) {
    console.log(data);
  });

  $listener.on(":quiz/results", function(e, data) {
    console.log("most similar result IDs to yours: ", data.items.slice(0,5));
  });
};

Quiz.prototype.updateUserScore = function(score) {
  var _this = this, i,
      newScore = this.state.currentScore

  for (i = 0; i < this.config.criteriaCount; i++) {
    this.state.currentScore[i] += score[i];    
  }
  $listener.trigger(":quiz/updatestatus", "User's score has been updated");
};


Quiz.prototype.getResults = function() {
  var similarities, sorted;
  similarities = this.calculateSimilarities();
  sorted = {
    items: this.sortResults(similarities)
  };
  $listener.trigger(":quiz/results", sorted);
};

Quiz.prototype.sortResults = function(items) {
  var sorted = _.sortBy(items, function(item) {
    return Math.floor(item.similarity)
  });
  return _.pluck(sorted, "result");
};

Quiz.prototype.calculateSimilarities = function() {
  var _this = this, userScore,
      similarities = [], i,
      absDifference;
  
  userScore = this.convertUserScore();

  _.each(this.config.results, function(result, i) {

    absDifference = _this.getAbsDifference(result.weight, userScore);

    similarities.push({
      result: i,
      similarity: absDifference
    });

  });
  return similarities;
};

Quiz.prototype.getAbsDifference = function(array1, array2) {
  var absDifference = 0, i;  
  for (i = 0; i < this.config.criteriaCount; i++) {
    absDifference += Math.abs(array1[i] - array2[i]);
  }
  return absDifference
};

Quiz.prototype.convertUserScore = function() {
  var _this = this,
      questionCount = this.config.questions.length,
      percentagizedArray = _.map(this.state.currentScore, function(score) {
        return score / questionCount;
      });
  return percentagizedArray;
};
