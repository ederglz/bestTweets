function getData(){
  var inputText = $('#input').val()
  var queryText;
  if(inputText == ""){
    $('.Intro-error').addClass('is-animated')
    $('#submitButton').addClass('is-error')
    return false
  }
  if(inputText.indexOf('@') == 0){
    queryText = inputText.replace('@', "");
  }else{
    queryText = inputText
  }
  var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fes.favstar.fm%2Fusers%2F"+ queryText +"'%20and%20xpath%3D'%2F%2Fa%5B%40class%3D%22fs-date%22%5D'&format=json&diagnostics=true&callback=?"
  $('#submitButton').text('')
  $('#input, #submitButton').addClass('is-loading')
  $('.Intro-error').removeClass('is-animated')
  $('#title').text(inputText)
  $.getJSON(url).done(function(data){
    displayData(data)
  })
}
function displayData(data) {
    var tweets = data.query.results.a.length
    for(var i = 0; i<tweets; i++){
      var tweetRef = data.query.results.a[i].href
      var tweetId = tweetRef.match(/\d/g).join("")
      var getTweetsUrl = 'https://api.twitter.com/1/statuses/oembed.json?id='+ tweetId +'&callback=?'
      $.getJSON(getTweetsUrl).done(function(embedTweetData){
        var tweetEmbed = embedTweetData.html
        $('#tweets').append(tweetEmbed)
      })
    }
}
function fadeOut(){
  if($('#rufous-sandbox').length == 1){
    $('#input').addClass('is-gone')
    $('.Layout-tweets').addClass('is-visible')
  }else{
    setTimeout(fadeOut, 50)
  }
}
function goBack() {
  $('#input').removeClass('is-gone')
  $('.Layout-tweets').removeClass('is-visible')
  $('#input, #submitButton').removeClass('is-loading')
  $('#title').text('Get best tweets from any account')
  $('#submitButton').text('Go!')
  $('#tweets').html('')
}
$(function(){
  $('.Intro-user').keypress(function(e){
    if(e.which==13){
      getData()
    }
  })
  $('#submitButton').on('click', getData)
  $('#goBackButton').on('click', goBack)
  fadeOut()
})
