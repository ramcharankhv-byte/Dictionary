document.addEventListener("DOMContentLoaded", () => {
  wordInp = document.getElementById("wordInp");
  sbmtBtn = document.getElementById("sbmtBtn");
  display = document.getElementById("display");

  sbmtBtn.addEventListener("click", async function () {
    let word = wordInp.value.trim();
    if (word) {
      try {
        display.innerHTML = "";
        let wordData = await getWordData(word);
        displayWord(wordData);
      } catch (error) {
        console.log(error);
        displayError("Something went wrong...");
        displayError(`Could not fetch the word ${word}`);
      }
    } else {
      display.innerHTML = "";
      displayError("Please Type Anything");
    }
  });
});

async function getWordData(word) {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const data = await fetch(apiUrl);

  if (!data.ok) {
    throw new Error(`Could not fetch the meaning of "${word}"`);
  }
  return await data.json();
}

function displayWord(wordData) {
  const wrdData = wordData;
  wrdData.forEach((element) => {
    let wordDisplay = document.createElement("div");
    wordDisplay.className =
      "flex-1 word-display bg-neutral-800 mx-2 my-2 rounded-sm text-zinc-100 p-2 border-zinc-700";
    console.log(element);
    let word = document.createElement("p");
    word.className = "text-2xl tracking-wide font-bold m-1";
    word.innerText = `${element.word}`;
    wordDisplay.appendChild(word);

    element.phonetics.forEach((phonetic) => {
      let phoneticDisplay = document.createElement("div");
      phoneticDisplay.className =
        "bordeer-thick my-2 text-md border-zinc-200 bg-neutral-700 rounded-sm px-2 py-2";
      if (phonetic.audio) {
        let phoneticAud = document.createElement("audio");
        phoneticAud.className = "mt-2 mb-3 h-8 mx-auto lg:mx-1";
        phoneticAud.src = phonetic.audio;
        phoneticAud.controls = true;
        phoneticAud.preload = "auto";
        phoneticDisplay.appendChild(phoneticAud);
      }
      if (phonetic.text) {
        let phoneticTxt = document.createElement("p");
        phoneticTxt.className = "text-lg tracking-wide";
        phoneticTxt.innerText = `Phonetic : ${phonetic.text} `;
        phoneticDisplay.appendChild(phoneticTxt);
      }
      wordDisplay.appendChild(phoneticDisplay);
    });

    element.meanings.forEach((meaning) => {
      let meaningDisplay = document.createElement("div");
      meaningDisplay.className =
        "bordeer-thick my-2 text-md border-zinc-200 bg-neutral-700 rounded-sm px-2 py-0";
      let partOfSpeech = document.createElement("p");
      partOfSpeech.className = "tracking-wide m-1";
      partOfSpeech.innerText = `Part of speech : ${meaning.partOfSpeech}`;
      meaningDisplay.appendChild(partOfSpeech);

      meaning.definitions.forEach((def) => {
        let wordMeaning = document.createElement("p");
        wordMeaning.className = "tracking-wide m-1";
        wordMeaning.innerText = `Meaning : ${def.definition}`;
        meaningDisplay.appendChild(wordMeaning);
        if (def.example) {
          let wordExample = document.createElement("p");
          wordExample.className = "tracking-wide m-1";
          wordExample.innerText = `Example : ${def.example}`;
          meaningDisplay.appendChild(wordExample);
        }
      });
      wordDisplay.appendChild(meaningDisplay);
    });

    display.appendChild(wordDisplay);
  });
}

function displayError(message) {
  let error = document.createElement("p");
  error.className = "text-xl text-center text-bold m-2";
  error.innerText = message;
  display.appendChild(error);
}
