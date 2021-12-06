import React, { useRef, useState, useEffect, useContext } from "react";
import { ReactReader } from "react-reader";
import Controls from "./Controls.jsx";
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GlobalContext } from "../GlobalContextProvider";
import Button from '@mui/material/Button';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import { useHistory } from 'react-router-dom';


// Books
const accessible = "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub";
const moby = "https://s3.amazonaws.com/moby-dick/OPS/package.opf";
const alice = "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf";
const music = ['fire', 'hulk', 'animal'];

responsiveVoice.enableEstimationTimeout = false;
responsiveVoice.enableWindowClickHook();

const Player = (props) => {
  const [page, setPage] = useState('');
  const [location, setLocation] = useState(null);
  const [selections, setSelections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const voiceOptions = responsiveVoice.getVoices();
  const [voice, setVoice] = useState(voiceOptions[0].name);
  const [backgroundV, setBackgroundV] = useState(0);
  const [voiceBackgroundV, setVoiceBackgroundV] = useState(0);
  const [firstPage, setFirstPage] = useState(true);
  const [selectedSong, setSelectedSong] = useState('fire');
  const backgroundS = document.getElementById('fire');

  const { value, setValue } = useContext(GlobalContext);

  //Voice Command
  let voiceCommandError = '';
  const commands = [
    {
      command: ['Text *'],
      callback: (input) => {
        if (fontSizeOptions.indexOf(Number(input)) !== -1) {
          setSize(Number(input));
        }
      }
    },
    {
      command: ['Open settings'],
      callback: () => {
        setShowModal(true);
        handlePause();
      }
    },
    {
      command: ['Volume *'],
      callback: (input) => {
        handlePause();
        setVoiceParameters({
          onstart: voiceParameters.onstart,
          onend: voiceParameters.onend,
          volume: Number(input) / 100,
          rate: voiceParameters.rate,
          pitch: voiceParameters.pitch,
        });
      }
    },
    {
      command: ['Speed *'],
      callback: (input) => {
        handlePause();
        setVoiceParameters({
          onstart: voiceParameters.onstart,
          onend: voiceParameters.onend,
          volume: voiceParameters.volume,
          rate: Number(input) / 100,
          pitch: voiceParameters.pitch,
        });
      }
    },
    {
      command: ['Pitch *'],
      callback: (input) => {
        handlePause();
        setVoiceParameters({
          onstart: voiceParameters.onstart,
          onend: voiceParameters.onend,
          volume: voiceParameters.volume,
          rate: voiceParameters.rate,
          pitch: Number(input) / 100,
        });
      }
    },
    {
      command: ['Background Music *'],
      callback: (input) => {
        handlePause();
        setVoiceBackgroundV(Number(input) / 100);
      }
    }
  ];

  const { transcript } = useSpeechRecognition({ commands });
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  };

  const [voiceParameters, setVoiceParameters] = useState({
    onstart: voiceStartCallback,
    onend: voiceEndCallback,
    volume: 0.5,
    pitch: 1,
    rate: 1
  });

  useEffect(() => {
    if (!isPlaying) {
      responsiveVoice.clickEvent();
      responsiveVoice.speak(remainingText.current, voice, voiceParameters);
      setPlaying(true);
      backgroundS.play();
    }
  }, [voiceParameters])

  useEffect(() => {
    if (voiceBackgroundV === 0) {
      backgroundS.pause();
    } else {
      backgroundS.play();
      backgroundS.volume = voiceBackgroundV;
    }
    handleResume();
  }, [voiceBackgroundV]);


  const [isPlaying, setPlaying] = useState(false);
  const [size, setSize] = useState(100);
  const [parameters, setParameters] = useState({
    onstart: voiceStartCallback,
    onend: voiceEndCallback,
    volume: 0.5,
    pitch: 1,
    rate: 1
  });

  const responsiveVoiceTextArray = useRef([]);
  const responsiveVoiceCurrentMsgIndex = useRef(null);
  const remainingText = useRef('');

  const renditionRef = useRef(null)
  const tocRef = useRef(null)

  const rangeRef = useRef(null)
  const _cfiRangeRef = useRef(null)
  const highlightedRef = useRef(false)
  const rangeRefValidChildrenRef = useRef(null)

  props.highlightBookRef.current = props.book.link;

  /**************************************************************************************************************
   * Experimental text-highlighting functionality (process intensive). Enable only as a demo for two books:
        * The Man Who Died Twice
        * The Assasin's Legacy
  ***************************************************************************************************************/
  function loop() {
    if (props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Man Who Died Twice by Richard Osman.epub"
      || props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub") {
      if (responsiveVoice) {
        if (responsiveVoice.currentMsg) {
          // Put additional contraint that text must be over 5 letters long
          if (responsiveVoice.currentMsg.text && responsiveVoice.currentMsg.text.trim().length > 5) {
            let responsiveVoiceCurrentMsgText = responsiveVoice.currentMsg.text.trim();
            // Remove quote if there's a quote as 1st character, then trim
            if (responsiveVoiceCurrentMsgText[0] === "'" || responsiveVoiceCurrentMsgText[0] === '"') {
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(1);
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.trim();
            }
            // Remove punctuation from the end if there's punctuation, then trim
            if (responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === ","
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "."
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === ";"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "!"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "?"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === "'"
              || responsiveVoiceCurrentMsgText[responsiveVoiceCurrentMsgText.length - 1] === '"'
            ) {
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(0, responsiveVoiceCurrentMsgText.length);
              responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.trim();
              if (responsiveVoiceCurrentMsgText.length > 0) { responsiveVoiceCurrentMsgText = responsiveVoiceCurrentMsgText.substring(1) };
            }

            if (rangeRef.current && renditionRef.current) {
              if (renditionRef.current.location) {
                // Ignore the cover page
                if (!renditionRef.current.location.atStart) {
                  // Make sure querySelectorAll function exists for the ref
                  if (rangeRefValidChildrenRef.current && rangeRefValidChildrenRef.current.length > 0) {
                    rangeRefValidChildrenRef.current.forEach((child, index) => {
                      if (child) {
                        if (child.innerHTML.indexOf(responsiveVoiceCurrentMsgText) !== -1) {
                          var foundChild = child;
                          var foundChildNext = rangeRefValidChildrenRef.current[index + 1]
                          var foundChildNodeArray = Array.prototype.slice.call(foundChild.childNodes);

                          if (foundChildNodeArray.indexOf(foundChildNext) !== -1) {
                            foundChildNext = rangeRefValidChildrenRef.current[index + 2]
                          }

                          var renditionRefContents = renditionRef.current.getContents();
                          var foundChildCFI = renditionRefContents[0].cfiFromNode(foundChild)
                          var foundChildNextCFI = foundChildNext ? renditionRefContents[0].cfiFromNode(foundChildNext) : renditionRef.current.location.end.cfi;

                          const _breakpoint = foundChildCFI.indexOf('!') + 1;
                          const _base = foundChildCFI.substring(0, _breakpoint);
                          const _startRange = foundChildCFI.substring(_breakpoint, foundChildCFI.length - 1);
                          const _endRange = foundChildNextCFI.substring(_breakpoint, foundChildNextCFI.length);
                          const _cfiRange = `${_base},${_startRange},${_endRange}`;

                          renditionRef.current.book.getRange(_cfiRange).then(function (range) {
                            if (_cfiRange !== _cfiRangeRef.current) {
                              renditionRef.current.annotations.remove(_cfiRangeRef.current, 'highlight');
                              _cfiRangeRef.current = _cfiRange;
                              highlightedRef.current = false;
                            }
                            if (highlightedRef.current !== null && highlightedRef.current !== undefined) {
                              if (!highlightedRef.current) {
                                renditionRef.current.annotations.add("highlight", _cfiRangeRef.current, {}, null, "hl", { "fill": "yellow", "fill-opacity": "0.5", "mix-blend-mode": "color" })
                              }
                            }
                            highlightedRef.current = true;
                          })
                            .catch((error) => {
                              console.log(error)
                            }
                            );
                        }
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    }

    setTimeout(function () {
      loop()
    }, 1000);
  };

  if (props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Man Who Died Twice by Richard Osman.epub"
    || props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub") {
    loop();
  }

  // Callbacks
  function voiceStartCallback() {
    console.log("Voice started");
  }

  function voiceEndCallback() {
    if (renditionRef.current.location.atEnd) {
      axios.put('/account/bookmark', {
        email: value,
        id: props.book['_id'],
        cfi: '',
        remainingText: '',
      })
        .catch(err => {
          console.log(err);
        })
    } else {
      var audio = document.getElementById('audio');
      if (window.SpeechSynthesisUtterance.text !== '') {
        audio.play();
        setTimeout(() => {
          if (renditionRef.current) {
            renditionRef.current.next()
          }
        }, 400);
      }
    }
  }

  const handlePause = () => {
    if (isPlaying) {
      responsiveVoiceTextArray.current = responsiveVoice.multipartText;
      responsiveVoiceCurrentMsgIndex.current = responsiveVoice.currentMsg.rvIndex;
      remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
      responsiveVoice.cancel();
      setPlaying(false);
      if (!renditionRef.current.location.atEnd) {
        axios.put('/account/bookmark', {
          email: value,
          id: props.book['_id'],
          cfi: `${location}`,
          remainingText: remainingText.current,
        })
          .catch(err => {
            console.log(err);
          })
      }
    }
  }

  const handleResume = () => {
    if (!isPlaying) {
      responsiveVoice.clickEvent();
      responsiveVoice.speak(remainingText.current, voice, parameters);
      setPlaying(true);
    }
  }

  const locationChanged = (epubcfi) => {
    responsiveVoice.cancel();
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      const chapter = tocRef.current.find((item) => item.href === href)
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : 'n/a'}`)
      if (firstPage && props.book.cfi && props.book.cfi.indexOf('\n') !== -1 && props.book.cfi !== 'null') {
        setFirstPage(false);
        setLocation(props.book.cfi.substring(0, props.book.cfi.length - 2));

      } else if (firstPage && props.book.cfi && props.book.cfi.indexOf('\n') === -1 && props.book.cfi !== 'null') {
        setFirstPage(false);
        setLocation(props.book.cfi);
      } else {
        setLocation(epubcfi)
      }

      const locationStartCfi = renditionRef.current.location.start.cfi;
      const locationEndCfi = renditionRef.current.location.end.cfi;
      const breakpoint = locationStartCfi.indexOf('!') + 1;
      const base = locationStartCfi.substring(0, breakpoint);
      const startRange = locationStartCfi.substring(breakpoint, locationStartCfi.length - 1);
      const endRange = locationEndCfi.substring(breakpoint, locationEndCfi.length);
      const cfiRange = `${base},${startRange},${endRange}`;

      renditionRef.current.book.getRange(cfiRange).then(function (range) {
        let text = range.toString().trim()
        remainingText.current = props.book.remainingText || text;
        axios.put('/account/bookmark', {
          email: value,
          id: props.book['_id'],
          cfi: epubcfi,
          remainingText: remainingText.current,
        })
          .catch(err => {
            console.log(err);
          })

        // Below section for experimental text-highlighting functionality only.
        if (props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Man Who Died Twice by Richard Osman.epub"
          || props.highlightBookRef.current === "https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub") {
          rangeRef.current = range.commonAncestorContainer;

          if (rangeRef.current && renditionRef.current) {
            if (renditionRef.current.location) {
              // Ignore the cover page
              if (!renditionRef.current.location.atStart) {
                if (rangeRef.current.querySelectorAll) {
                  var rangeRefCurrentChildren = rangeRef.current.querySelectorAll("*");
                  var rangeRefValidChildren = [];
                  rangeRefCurrentChildren.forEach((child, index) => {
                    if (child) {
                      // Filter for valid children nodes.
                      // Inner text must exist; this is to filter out nodes with only other child nodes but no text.
                      if (child.innerText.length > 0) {
                        // Remove italic, emphasized, bold, break tags; prevent "nextChild" from being a styled subset of "currentChild".
                        if (
                          child.outerHTML.substring(0, 3) !== '<i>'
                          && child.outerHTML.substring(0, 3) !== '<b>'
                          && child.outerHTML.substring(0, 3) !== '<br'
                          && child.outerHTML.substring(0, 3) !== '<em') {
                          rangeRefValidChildren.push(child)
                        }
                      }
                      if (rangeRefValidChildren && rangeRefValidChildren.length > 0) {
                        rangeRefValidChildrenRef.current = rangeRefValidChildren;
                      }
                    }
                  })
                }
              }
            }
          }
        }

        if (remainingText.current && remainingText.current.length > 0 && remainingText.current !== "\n") {
          responsiveVoice.speak(remainingText.current, voice, parameters);
          props.book.remainingText = '';
          setPlaying(true);
        }
      })
    }
  }

  const handleVolumeChange = (e) => {
    e.preventDefault();
    const newVolume = e.target.value;
    setParameters({
      onstart: voiceStartCallback,
      onend: voiceEndCallback,
      volume: newVolume,
      rate: parameters.rate,
      pitch: parameters.pitch
    })
    handlePause();
  }


  backgroundS.onended = function () {
    backgroundS.play()
  };

  useEffect(() => {
    backgroundS.play();
    backgroundS.volume = backgroundV;
  }, []);

  useEffect(() => {
    if (!showModal) {
      if (responsiveVoice.multipartText && responsiveVoice.currentMsg) {
        if (backgroundV === 0) {
          backgroundS.pause();
        } else {
          backgroundS.play();
          backgroundS.volume = backgroundV;
        }
        remainingText.current = responsiveVoiceTextArray.current.slice(responsiveVoiceCurrentMsgIndex.current).join('');
        if (remainingText.current !== '') {
          handleResume();
        }
      }
    }
  }, [showModal]);

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${size}%`)
      handleResume();
    }
  }, [size])

  const history = useHistory();

  const handleBackToAccount = () => {
    handlePause();
    backgroundS.pause();
    history.push('/home');
  };

  return (
    <div>
      <div style={{ zIndex: 20, position: 'absolute', top: '0%', left: '0%', width: '100%', height: "80vh" }}>
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={props.book.link}
          getRendition={(rendition) => {
            renditionRef.current = rendition
            renditionRef.current.themes.default({
              '::selection': {
                'background': 'orange'
              }
            })
            renditionRef.current.themes.fontSize(`${size}%`)
            setSelections([])
          }}
          tocChanged={toc => tocRef.current = toc}
        />
      </div>
      <div style={{ height: '20vh', position: 'absolute', top: '80%', left: '0%', width: '100%', zIndex: 20 }}>
        <Controls isPlaying={isPlaying} showModal={showModal} setShowModal={setShowModal} handleResume={handleResume} handlePause={handlePause} handleVolumeChange={handleVolumeChange} setSize={setSize} parameters={parameters} setParameters={setParameters} page={page} book={props.book} voiceOptions={voiceOptions} voice={voice} setVoice={setVoice} backgroundV={backgroundV} setBackgroundV={setBackgroundV} selectedSong={selectedSong} setSelectedSong={setSelectedSong} music={music} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant='contained'
            size='small'
            style={{ backgroundColor: '#11A797' }}
            type='button'
            onClick={() => {
              handlePause();
              backgroundS.pause();
              SpeechRecognition.startListening();
            }}
          >
            <SettingsVoiceIcon />
          </Button>
          <p id="transcript">Transcript: {transcript}</p>
        </div>
      </div>
      <Button
        style={{ backgroundColor: '#0c6057', position: 'absolute', top: '2%', left: '40vw', zIndex: 30, fontSize: '70%', padding: '0.5vw 2vw' }}
        variant='contained'
        type='button'
        onClick={handleBackToAccount}
      >
        Back to Account
      </Button>
    </div>
  )
};

const fontSizeOptions = [25, 50, 100, 125, 150, 175, 200];

export default Player;