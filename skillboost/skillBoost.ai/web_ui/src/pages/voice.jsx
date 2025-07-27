import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function MicComponent() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div>
      <i class="fa-solid fa-microphone" onClick={SpeechRecognition.startListening}></i>
    </div>
  );
}

export default MicComponent;
