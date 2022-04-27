window.onload = function(){ 
// faq collapsible

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// Language selection

var selectedLang = "en-EN";

document.getElementById('language-dropdown').addEventListener('change', function() {
  var selectedLang = this.value;
  console.log('You selected: ', selectedLang);
  recognition.lang = selectedLang;
});

// Voice recognition

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var synth = window.speechSynthesis;

recognition.continuous = false;

recognition.interimResults = false;
recognition.maxAlternatives = 1;

var startButton = document.querySelector("#mic-button");

startButton.onclick = function() {
    recognition.start();
    console.log('Speech recognition language:', recognition.lang);
    console.log('Start speaking!');
}

var conversation = document.querySelector(".input-text");


recognition.onresult = function(event) {
    var utt = event.results[0][0].transcript;
    conversation.textContent = utt;
    console.log('Confidence: ' + event.results[0][0].confidence)
}

recognition.onspeechend = function() {
    recognition.stop();
}


// Transcription

document.getElementById('transcribe-button').addEventListener('click', function() {
  var inputText = document.getElementById('text-to-transcribe').value.toLowerCase().split(/([\.|,|:|;|\n])\s{0,1}/);
  console.log(inputText);

  transcribedText = [];

  for (const sentence of inputText) {
    var sentenceArray = sentence.split(" ");
    transcribedText.push(transcribeUK(sentenceArray));
  }

  document.getElementById("output-text").innerHTML = transcribedText.filter(checkifvalid).join(" ");

  function checkifvalid(text){
    return text != '//';
  }

  function transcribeUK(inputSentence) {
    var transcribedSen = [];
    for (const word of inputSentence) {
      var transcribedWord = UK_dict[word];
      console.log(transcribedWord);
      if (transcribedWord == undefined) {
        transcribedSen.push('');
      } else {
      transcribedSen.push(transcribedWord)
    }};
    return '/'+transcribedSen.join(" ")+'/';
  }
});}
