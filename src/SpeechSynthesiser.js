import React, { Component } from "react";
import Speech from "speak-tts";
import classnames from "classnames";

class SpeechSynthesiser extends Component {
  state = {
    textInput: "",
    pitchValue: "1",
    rateValue: "0.9",
    dataLang: "en-US"
  };
  onChange = e => {
    e.preventDefault();
    // console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const { textInput, dataLang, rateValue, pitchValue } = this.state;

    if (textInput === "") {
      alert("Enter some text in the input box.");
    } else {
      let speech = new Speech();
      speech.setLanguage(dataLang);
      speech.setRate(rateValue);
      speech.setPitch(pitchValue);
      // speech.speak("textInput");
      speech
        .speak({
          text: textInput,
          queue: false,
          listeners: {
            onstart: () => {
              // console.log("Start utterance");
            },
            onend: () => {
              // console.log("End utterance");
            },
            onresume: () => {
              // console.log("Resume utterance");
            },
            onboundary: event => {
              console.log(
                event.name +
                  " boundary reached after " +
                  event.elapsedTime +
                  " milliseconds."
              );
            }
          }
        })
        .then(() => {
          // console.log("Success !");
        })
        .catch(e => {
          console.error("An error occurred :", e);
        });
    }
  };
  componentDidMount() {
    let select = document.getElementById("selectElement");
    //Voices start
    let speech = new Speech();
    if (speech.hasBrowserSupport()) {
      // console.log("speech synthesis supported");
    }
    select.onchange = () => {
      const selected = select.options[select.selectedIndex];
      const lang = selected.getAttribute("data-lang");
      this.setState({ dataLang: lang });
    };
    speech
      .init()
      .then(data => {
        // console.log(data.voices);
        const voices = data.voices;
        for (let i = 0; i < data.voices.length; i++) {
          var option = document.createElement("option");
          option.text = voices[i].name;
          option.value = i;
          option.setAttribute("data-lang", voices[i].lang);
          select.appendChild(option, i);
        }
      })
      .catch(e => {
        console.error("An error occured while initializing : ", e);
      });
  }
  render() {
    const { pitchValue, rateValue, textInput } = this.state;
    return (
      <div className="App container text-center py-3">
        <h1>Text to Speech</h1>
        <p className="my-3">
          Enter some text in the input below and press return or the "play"
          button to hear it. change voices using the dropdown menu.
        </p>
        <form onSubmit={this.onSubmit}>
          <input
            id="textInputField"
            type="text"
            className="w-100 mt-4"
            style={{ height: "50px" }}
            onChange={this.onChange}
            name="textInput"
            maxLength="5000"
            minLength="3"
            // defaultValue="Hi"
            placeholder="Enter text here and click on play..."
          />
          <div
            className="d-flex my-3"
            style={{ alignItems: "center-align", justifyContent: "center" }}
          >
            <label htmlFor="rate" className="" style={{ width: "10%" }}>
              Rate:{" "}
            </label>
            <input
              type="range"
              name="rateValue"
              id="rate"
              step="0.1"
              min="0.5"
              max="2"
              defaultValue={rateValue}
              className="mx-2"
              style={{ width: "100%" }}
              onChange={this.onChange}
            />
            <div className="rateValue" style={{ width: "10%" }}>
              {this.state.rateValue === "" ? 0.5 : this.state.rateValue}
            </div>
          </div>
          <div
            className="d-flex my-3"
            style={{ alignItems: "center-align", justifyContent: "center" }}
          >
            <label htmlFor="pitch" className="" style={{ width: "10%" }}>
              Pitch:{" "}
            </label>
            <input
              type="range"
              name="pitchValue"
              id="rate"
              step="0.1"
              min="0"
              max="2"
              defaultValue={pitchValue}
              className="mx-2"
              style={{ width: "100%" }}
              onChange={this.onChange}
            />
            <div className="pitchValue" style={{ width: "10%" }}>
              {this.state.pitchValue === "" ? 0 : this.state.pitchValue}
            </div>
          </div>
          <div>
            <div className="input-group mb-3">
              <select className="custom-select" id="selectElement">
                {/* <option defaultValue>Choose...</option> */}
              </select>
            </div>
          </div>
          <div>
            <button className="btn btn-dark my-3 w-50">PLAY</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SpeechSynthesiser;
