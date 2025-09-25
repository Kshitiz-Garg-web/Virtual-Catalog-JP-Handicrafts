
const voiceBtn = document.getElementById("voiceBtn");
const searchBox = document.getElementById("searchInput");


voiceBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser!");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "en-IN";

  recognition.start();

  recognition.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("");

    searchBox.value = transcript; 
    searchBox.dispatchEvent(new Event("input")); // force trigger search to avoid manually, jiss s ki khud s focus hoja
  });

  recognition.addEventListener("end", () => {
    console.log("Speech recognition ended");
  });
});