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

function save() {	
	var checkbox = document.getElementById("checkbox");
    localStorage.setItem("checkbox", checkbox.checked);	
}

// //for loading
var checked = JSON.parse(localStorage.getItem("checkbox"));
    document.getElementById("checkbox").checked = checked;
    switchTheme()

toggleSwitch.addEventListener('change', save);
toggleSwitch.addEventListener('change', switchTheme);


function switchTheme() {
  const check = document.getElementById("checkbox").checked
  if (check == true) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById("moon").style.display = "block";
      document.getElementById("sun").style.display = "none";
  }
  else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("moon").style.display = "none";
        document.getElementById("sun").style.display = "block";
  }
};

try {
document.getElementById('mobile-button').addEventListener('click', displaymenu);
} catch {

};

try {
document.getElementById('mobile-button-sub').addEventListener('click', displaymenusub);
} catch {
  
};

function displaymenu() {
  if (document.getElementById("mobile-menu").style.display == "none"||document.getElementById("mobile-menu").style.display == ""){
    document.getElementById("mobile-menu").style.display = "block";
  } else {
    document.getElementById("mobile-menu").style.display = "none";
  }
};

function displaymenusub() {
  if (document.getElementById("mobile-menu-sub").style.display == "none"||document.getElementById("mobile-menu-sub").style.display == ""){
    document.getElementById("mobile-menu-sub").style.display = "block";
  } else {
    document.getElementById("mobile-menu-sub").style.display = "none";
  }
};

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
  document.getElementById('numpinyintext').value = '';
  document.getElementById('numpinyintext').textContent = '';
  document.getElementById('pinyintext').value = '';
  document.getElementById('pinyintext').textContent = '';
  document.getElementById('ipatext').value = '';
  document.getElementById('ipatext').textContent = '';
  document.getElementById('tipatext').value = '';
  document.getElementById('tipatext').textContent = '';
  document.getElementById('xsampatext').value = '';
  document.getElementById('xsampatext').textContent = '';

  
  var inputText = document.getElementById('text-to-transcribe').value;

  var wordLang = ["en-EN", "en-US"]; //languages that can be searched by word
  var clauseLang = ["ja","zh-CN"]; //languages that should be searched by clauses


  // start for word-based languages
  if (wordLang.includes(selectedLang)) {
    inputText = inputText.toLowerCase().split(/[[\.]|[\?]|[\!]|[\n]]*/);
    for (const sentence of inputText) {
      var sentenceArray = sentence.split(" ").filter((a) => a);
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
      while (clause.length != 0){
        while (selectedLang == 'zh-CN' && dictionary.hasOwnProperty(clause) == false){
          if (transcribeWord(clause.split("").pop(), selectedLang) == undefined) {
            clause = clause.split("").slice(0, -1).join("");
          }
          left.push(clause.split("").pop());
          clause = clause.split("").slice(0, -1).join("");
          if (clause.length == 0) {
            break
          }
        }
        // Japanese but it didn't work properly
        while (selectedLang == 'ja' && dictionary.hasOwnProperty(clause) == false){
          if (transcribeWord(clause.split("").pop(), selectedLang) == undefined) {
            clause = clause.split("").slice(0, -1).join("");
          }
          left.push(clause.split("").pop());
          clause = clause.split("").slice(0, -1).join("");
          if (clause.length == 0) {
            break
          }
        }
        IPASen.push(transcribeWord(clause, selectedLang));
        clause = left.reverse().join("");
        left = [];
      }
      IPAText.push("/"+IPASen.filter((a) => a).join(" ")+"/");
      IPASen = [];
    }

    //Chinese: Pinyin API
    if (selectedLang == 'zh-CN') {
      const rdot = /。/g;
      const rcomma = /，/g;
      let url = 'https://helloacm.com/api/pinyin/?cached&s=' + inputText.replace(rdot,".").replace(rcomma,",").replace(/[\s]+/,"") + '&t=1';


      fetch(url)
      .then(response => response.json())
      .then(response => {

        numpinyintext.innerHTML = "";
        pinyintext.innerHTML = "";
        let p = document.createElement("p");
        const regex = /(,[a-z1-9]*)/g;
        const rdots = /\s\./g;
        const rcommas = /\s\,/g;
        
        let innerContent = `<b>Numerical Pinyin:</b> ${response["result"].join(" ").replaceAll(regex,"").replaceAll(rdots,'.').replaceAll(rcommas,',')}`;
        p.innerHTML = innerContent;
        numpinyintext.appendChild(p);

        p = document.createElement("p");
        innerContent = `<b>Pinyin:</b> ${PinyinConverter.convert(response["result"].join(" ").replaceAll(regex,"").replaceAll(rdots,'.').replaceAll(rcommas,','))}`;
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

            hiraganatext.innerHTML = "";
            let p = document.createElement("p");
            const rspaces = /[\s]*/g;

            let innerContent = `<b>Hiragana:</b> ${data["converted"].replaceAll(rspaces,"")}`;
            p.innerHTML = innerContent;
            hiraganatext.appendChild(p) 
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

            katakanatext.innerHTML = "";
            let p = document.createElement("p");
            const rspaces = /[\s]*/g;

            let innerContent = `<b>Katakana:</b> ${data["converted"].replaceAll(rspaces,"")}`;
            p.innerHTML = innerContent;
            katakanatext.appendChild(p) 
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

            romajitext.innerHTML = "";
            let p = document.createElement("p");
            const rspaces = /[\s]*/g;

            let innerContent = `<b>Romaji:</b> ${wanakana.toRomaji(data["converted"], { upcaseKatakana: true })}`;
            p.innerHTML = innerContent;
            romajitext.appendChild(p) 
          }
        });
      }

    };
  };

  // Transcribe function for word-based languages

  function transcribeSentence(inputSentence, lang) {
    var IPASen = [];
    for (var word of inputSentence) {
      word = word.replace(/[&\/\\#,+()$~%'":*<>{}]/g, "");
      if (lang == "en-EN"){
        var IPAWord = UK_dict[word];
      } else if (lang == "en-US"){
        var IPAWord = US_dict[word];
      }
      if (IPAWord == undefined) {
        IPASen.push('');
      } else {
        IPASen.push(IPAWord);
      }
    };
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


  if (IPAText.length != 0){
    // document.getElementById("ipatext").innerHTML = '<b>IPA:</b> ' + IPAText.filter(checkifvalid).join(" ");
    ipatext.innerHTML = "";
    let p = document.createElement("p");
    let IPA = IPAText.filter(checkifvalid).join(" ");
    let innerContent = `<b>IPA:</b> ${IPA}`;
    p.innerHTML = innerContent;
    ipatext.appendChild(p);

    if (selectedLang == "en-EN"||selectedLang == "en-US") {
    
    p = document.createElement("p");
    let xsampa = convertIPA(IPA, dict_xsampa);
    innerContent = `<b>X-SAMPA:</b> ${xsampa}`;
    p.innerHTML = innerContent;
    xsampatext.appendChild(p);
    
    tipatext.innerHTML = "";
    p = document.createElement("p");
    let tipa = convertIPA(IPA, dict_tipa);
    innerContent = `<b>TIPA:</b> ${tipa}`;
    p.innerHTML = innerContent;
    tipatext.appendChild(p);
    IPAText = [];
    } else {
      document.getElementById("xsampatext").style.display = "none";
    };
  };

  function convertIPA(phrase, alphabet) {
    var newTrans = [];
    for (var letter of phrase) {
      var newL = alphabet[letter];
      if (newL == undefined) {
        newTrans.push(letter);
      } else {
        newTrans.push(newL);
      }
    };
    if (alphabet == dict_tipa) {
      return "\\textipa{"+newTrans.join("")+"}";
    } else {
      return newTrans.join("");
    };
  };
  
  // if (TIPAText.length != 0){
  //   document.getElementById("tipa-text").innerHTML = '<b>TIPA:</b> ' + TIPAText.filter(checkifvalid).join(" ");
  // };
  
  function checkifvalid(text){
    return text != '//';
  };
  
});

//checking alphabets contents

// checkCharas(UK_dict,dict_xsampa);
// checkCharas(UK_dict,dict_tipa);
// checkCharas(US_dict,dict_xsampa);
// checkCharas(US_dict,dict_tipa);

// function checkCharas(lang_dict, dict_alp){
//   let allCharas = [];
//   for (word in lang_dict){
//     word = lang_dict[word];
//     for (var letter of word){
//       if (!(allCharas.includes(letter))){
//         allCharas.push(letter);
//       };
//     };
//   };
//   let notIn = [];
//   for (var l of allCharas){
//     if (!(l in dict_alp)){
//       notIn.push(l);
//     }
//   };
//   console.log(notIn)
// };

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