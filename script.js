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

// Voice recognition

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var synth = window.speechSynthesis;

recognition.continuous = false;
recognition.lang = 'en-EN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var startButton = document.querySelector("#mic-button");

startButton.onclick = function() {
    recognition.start();
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


}
