var $listener = $("#listener");

var QuizUI = function() {
  this.init();
};

QuizUI.prototype.init = function() {

  this.quiz = new Quiz({
    questions: questions,
    results: results
  });

  this.listen();
  this.populateForm();
};

QuizUI.prototype.listen = function() {
  var _this = this;

  $("#quiz").on("click", "a.answer", function(e) {
    e.preventDefault();
    _this.sendAnswer($(this).data("answerid"), $(this).data("questionid"));
  });

  $("#submit").on("click", function(e) {
    e.preventDefault();
    _this.quiz.getResults();
  });
};

QuizUI.prototype.populateForm = function() {
  var formElements = "";
  _.each(questions, function(question, i) {
    formElements += "<div>";
    formElements += "<h3>" + question.question + "</h3>";
    _.each(question.answers, function(answer, j) {
      formElements += "<a href='' class='answer' data-questionid='" + i + "' data-answerid='" + j + "'>" + answer.name + "</a><br/>";
    });
    formElements += "</div>";
  });
  $("#quiz").html(formElements);
};

QuizUI.prototype.sendAnswer = function(answer, question) {
  var data = questions[question].answers[answer];
  console.log(data);
  $listener.trigger(":quiz/answer", data);
};

new QuizUI();