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

//Dark mode

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById("sun").style.display = "block";
        document.getElementById("moon").style.display = "none";
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("sun").style.display = "none";
        document.getElementById("moon").style.display = "block";
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Language selection

var selectedLang = "en-EN"; //default language

document.getElementById('language-dropdown').addEventListener('change', function() {
  selectedLang = this.value;
  console.log('You selected: ', selectedLang);
  recognition.lang = selectedLang;
});

//Counters

let textArea = document.getElementById("text-to-transcribe");
let characterCounter = document.getElementById("characters-count");
const maxNumOfChars = 1000;

const countCharacters = () => {
  let numOfEnteredChars = textArea.value.length;
  let counter = numOfEnteredChars;
  characterCounter.textContent = counter + "/1000";
};

textArea.addEventListener("input", countCharacters);

//Transcription

document.getElementById('transcribe-button').addEventListener('click', function() {

  //Clear previous outputs
  var IPAText = [];
  var TIPAText = [];

  document.getElementById('hiraganatext').value = '';
  document.getElementById('hiraganatext').textContent = '';
  document.getElementById('romajitext').value = '';
  document.getElementById('romajitext').textContent = '';
  document.getElementById('katakanatext').value = '';
  document.getElementById('katakanatext').textContent = '';
  document.getElementById('pinyintext').value = '';
  document.getElementById('pinyintext').textContent = '';
  document.getElementById('ipatext').value = '';
  document.getElementById('ipatext').textContent = '';

  
  var inputText = document.getElementById('text-to-transcribe').value;

  var wordLang = ["en-EN", "en-US"]; //languages that can be searched by word
  var clauseLang = ["ja","zh-CN"]; //languages that should be searched by clauses


  // start for word-based languages
  if (wordLang.includes(selectedLang)) {
    inputText = inputText.toLowerCase().split(/[[\.]|[\?]|[\!]|[\n]]*/);
    for (const sentence of inputText) {
      var sentenceArray = sentence.split(" ").filter((a) => a);
      console.log(sentenceArray)
      IPAText.push(transcribeSentence(sentenceArray, selectedLang));
    }
  };

  // start for clause-based languages
  if (clauseLang.includes(selectedLang)) {
    if (selectedLang == 'zh-CN') {
      var dictionary = zhs_dict;
    } else if (selectedLang == 'ja') {
       var dictionary = ja_dict;
    };
    IPASen = []
    sentences = inputText.replace("。"," ").replace("，"," ").split(" ");
    if (selectedLang == 'ja') {
      sentences = sentences.filter((a) => a)
    };
    var left = [];
    for (clause of sentences) {
      console.log(clause)
      while (clause.length != 0){
        while (selectedLang == 'zh-CN' && dictionary.hasOwnProperty(clause) == false){
          if (transcribeWord(clause.split("").pop(), selectedLang) == undefined) {
            clause = clause.split("").slice(0, -1).join("");
          }
          console.log(clause)
          left.push(clause.split("").pop());
          clause = clause.split("").slice(0, -1).join("");
          if (clause.length == 0) {
            break
          }
        }
        // Japanese but it didn't work properly
        while (selectedLang == 'ja' && dictionary.hasOwnProperty(clause) == false){
          if (transcribeWord(clause.split("").pop(), selectedLang) == undefined) {
            console.log(transcribeWord(clause.split("").pop(), selectedLang))
            console.log(clause.split("").slice(0, -1).join(""))
            clause = clause.split("").slice(0, -1).join("");
          }
          left.push(clause.split("").pop());
          // console.log(left)
          clause = clause.split("").slice(0, -1).join("");
          if (clause.length == 0) {
            break
          }
        }
        console.log(transcribeWord(clause, selectedLang));
        IPASen.push(transcribeWord(clause, selectedLang));
        clause = left.reverse().join("");
        console.log(IPASen)
        left = [];
      }
      IPAText.push("/"+IPASen.filter((a) => a).join(" ")+"/");
      IPASen = [];
    }

    //Chinese: Pinyin API
    if (selectedLang == 'zh-CN') {
      console.log(inputText)
      const rdot = /。/g;
      const rcomma = /，/g;
      let url = 'https://helloacm.com/api/pinyin/?cached&s=' + inputText.replace(rdot,".").replace(rcomma,",").replace(/[\s]+/,"") + '&t=1';
      console.log(url);


      fetch(url)
      .then(response => response.json())
      .then(response => {

        pinyintext.innerHTML = "";
        let p = document.createElement("p");
        const regex = /(,[a-z1-9]*)/g;
        const rdots = /\s\./g;
        const rcommas = /\s\,/g;
        
        let innerContent = `<p><b>Numerical Pinyin:</b> ${response["result"].join(" ").replaceAll(regex,"").replaceAll(rdots,'.').replaceAll(rcommas,',')}</p>
        <p><b>Pinyin:</b> ${PinyinConverter.convert(response["result"].join(" ").replaceAll(regex,"").replaceAll(rdots,'.').replaceAll(rcommas,','))}</p>`;
        p.innerHTML = innerContent;
        pinyintext.appendChild(p);
      });
    }

    //Japanese hiragana, katakana, romaji
    if (selectedLang == 'ja') {

      hiragana(inputText)
      katakana(inputText)
      romaji(inputText)

      function hiragana(text){
        var data = {
          app_id: '52295368a431ddbec85158bc27ef6a00468def8760db56ca6a61f17a547bfa06',
          sentence: text,
          output_type: "hiragana",
        };
     
        jsonEncoded = JSON.stringify(data);

        $.ajax({
          type: "POST",
          url: "https://labs.goo.ne.jp/api/hiragana",
          contentType: "application/json",
          data: jsonEncoded,
            success: function(data) {
            console.log(data["converted"]);

            hiraganatext.innerHTML = "";
            let h = document.createElement("h");
            const rspaces = /[\s]*/g;

            let innerContent = `<b>Hiragana:</b> ${data["converted"].replaceAll(rspaces,"")}`;
            h.innerHTML = innerContent;
            hiraganatext.appendChild(h) 
          }
        });
      }

      function katakana(text){
        var data = {
          app_id: '52295368a431ddbec85158bc27ef6a00468def8760db56ca6a61f17a547bfa06',
          sentence: text,
          output_type: "katakana",
        };
    
        jsonEncoded = JSON.stringify(data);
    
        $.ajax({
          type: "POST",
          url: "https://labs.goo.ne.jp/api/hiragana",
          contentType: "application/json",
          data: jsonEncoded,
            success: function(data) {
            console.log(data["converted"]);

            katakanatext.innerHTML = "";
            let k = document.createElement("k");
            const rspaces = /[\s]*/g;

            let innerContent = `<b>Katakana:</b> ${data["converted"].replaceAll(rspaces,"")}`;
            k.innerHTML = innerContent;
            katakanatext.appendChild(k) 
          }
        });
      }

      function romaji(text){
        var data = {
          app_id: '52295368a431ddbec85158bc27ef6a00468def8760db56ca6a61f17a547bfa06',
          sentence: text,
          output_type: "hiragana",
        };
     
        jsonEncoded = JSON.stringify(data);

        $.ajax({
          type: "POST",
          url: "https://labs.goo.ne.jp/api/hiragana",
          contentType: "application/json",
          data: jsonEncoded,
            success: function(data) {
            console.log(data["converted"]);

            romajitext.innerHTML = "";
            let r = document.createElement("r");
            const rspaces = /[\s]*/g;

            let innerContent = `<b>Romaji:</b> ${wanakana.toRomaji(data["converted"])}`;
            r.innerHTML = innerContent;
            romajitext.appendChild(r) 
          }
        });
      }

    };
  };

  // Transcribe function for word-based languages

  function transcribeSentence(inputSentence, lang) {
    var IPASen = [];
    console.log(lang);
    for (var word of inputSentence) {
      word = word.replace(/[&\/\\#,+()$~%'":*<>{}]/g, "");
      if (lang == "en-EN"){
        var IPAWord = UK_dict[word];
      } else if (lang == "en-US"){
        var IPAWord = US_dict[word];
      }
      console.log(IPAWord);
      if (IPAWord == undefined) {
        IPASen.push('');
      } else {
        IPASen.push(IPAWord);
      }
    };
    console.log(IPASen)
    return '/'+IPASen.join(" ")+'/';
  };

  // Transcribe word function for clause-based languages

  function transcribeWord(word, lang) {
    if (lang == "zh-CN"){
      var IPAWord = zhs_dict[word];
    }
    if (lang == "ja"){
      var IPAWord = ja_dict[word];
    }
    return IPAWord;
  };
  

  
  // if (selectedLang == "ja"){
  //   IPAText = []; //So the japanese IPA won't appear for know
  // }; 

  console.log(IPAText)
  if (IPAText.length != 0){
    // document.getElementById("ipatext").innerHTML = '<b>IPA:</b> ' + IPAText.filter(checkifvalid).join(" ");
    ipatext.innerHTML = "";
    let p = document.createElement("p");
    let innerContent = `<b>IPA:</b> ${IPAText.filter(checkifvalid).join(" ")}`;
    p.innerHTML = innerContent;
    ipatext.appendChild(p);
    IPAText = [];
  };
  
  // if (TIPAText.length != 0){
  //   document.getElementById("tipa-text").innerHTML = '<b>TIPA:</b> ' + TIPAText.filter(checkifvalid).join(" ");
  // };
  
  function checkifvalid(text){
    return text != '//';
  };
  
});

// Voice recognition - needs to be at the bottom!

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
};
};