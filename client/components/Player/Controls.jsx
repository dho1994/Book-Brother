import React, { useRef, useState, useEffect } from "react"
import { ReactReader } from "react-reader"
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import ModalUnstyled from '@mui/core/ModalUnstyled';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Controls = ({ handleResume, handlePause, parameters, setParameters, showModal, setShowModal, page, book, isPlaying, handleVolumeChange, voiceOptions, voice, setVoice, setSize, backgroundV, setBackgroundV, selectedSong, setSelectedSong, music }) => {
  const [anchorElFont, setAnchorElFont] = useState(null);
  const openFont = Boolean(anchorElFont);
  const handleClickFontSize = (e) => {
    setAnchorElFont(e.currentTarget);
  };
  const handleCloseFontSize = () => {
    setAnchorElFont(null);
  };
  const [anchorElVoice, setAnchorElVoice] = useState(null);
  const openVoice = Boolean(anchorElVoice);
  const handleClickVoiceOption = (e) => {
    setAnchorElVoice(e.currentTarget);
  };
  const handleCloseVoiceOption = () => {
    setAnchorElVoice(null);
  };
  const [anchorElMusic, setAnchorElMusic] = useState(null);
  const openMusic = Boolean(anchorElMusic);
  const handleClickMusicOption = (e) => {
    setAnchorElMusic(e.currentTarget);
  };
  const handleCloseMusicOption = () => {
    setAnchorElMusic(null);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {page}
        <h1 style={{ fontSize: '3vh' }}>{book.title}</h1>
        <div id="audio-controls">
          <Button
            style={{ marginRight: '1rem' }}
            sx={{
              backgroundColor: '#11A797',
              ':hover': {
                backgroundColor: '#70baa4',
              },
            }}
            size='small'
            variant='contained'
            type='button'
            onClick={() => { setShowModal(true); handlePause() }}
          >
            <SettingsIcon />
          </Button>
          {isPlaying ? (
            <Button
              style={{ marginRight: '1rem' }}
              sx={{
                backgroundColor: '#11A797',
                ':hover': {
                  backgroundColor: '#70baa4',
                },
              }}
              size='small'
              variant='contained'
              type='button'
              onClick={handlePause}
            >
              <PauseCircleOutlineIcon />
            </Button>
          ) : (
            <Button
              style={{ marginRight: '1rem' }}
              sx={{
                backgroundColor: '#11A797',
                ':hover': {
                  backgroundColor: '#70baa4',
                },
              }}
              size='small'
              variant='contained'
              type='button'
              onClick={handleResume}
            >
              <PlayCircleOutlineIcon />
            </Button>
          )}
          <Button
            id="demo-positioned-button"
            aria-controls="demo-positioned-menu"
            aria-haspopup="true"
            aria-expanded={openFont ? 'true' : undefined}
            style={{ marginRight: '1rem' }}
              sx={{
                backgroundColor: '#11A797',
                ':hover': {
                  backgroundColor: '#70baa4',
                },
              }}
            size='small'
            variant='contained'
            type='button'
            onClick={handleClickFontSize}
          >
            <FormatSizeIcon />
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorElFont}
            open={openFont}
            onClose={handleCloseFontSize}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {fontSizeOptions.map(item => (
              <MenuItem style={{ fontSize: '1.5vh' }} onClick={() => {
                setSize(item);
                handlePause();
              }}>
                {`${item}%`}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showModal}
        onClose={() => { setShowModal(false); handlePause() }}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2vh' }}>Voice&nbsp;</h2>
            <div style={{ width: '20vh', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem' }}>
              <VolumeDown />
              <Slider
                style={{ color: '#11A797', margin: '0 0.5rem' }}
                aria-label="Voice Volume"
                min={0}
                max={1}
                step={0.1}
                value={parameters.volume}
                onChange={(e) => {
                  handleVolumeChange(e);
                }}
              />
              <VolumeUp />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2vh' }}>Speed&nbsp;</h2>
            <div style={{ width: '20vh', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem' }}>
              <RemoveIcon />
              <Slider
                min={0.1}
                max={2}
                step={0.1}
                value={parameters.rate}
                onChange={(e) => {
                  e.preventDefault();
                  setParameters({
                    onstart: parameters.onstart,
                    onend: parameters.onend,
                    volume: parameters.volume,
                    rate: e.target.value,
                    pitch: parameters.pitch,
                  });
                  handlePause();
                }}
                style={{ color: '#11A797', margin: '0 0.5rem' }}
                aria-label="Volume"
              />
              <AddIcon />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2vh' }}>Pitch&nbsp;</h2>
            <div style={{ width: '20vh', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem' }}>
              <RemoveIcon />
              <Slider
                min={0.1}
                max={2}
                step={0.1}
                value={parameters.pitch}
                onChange={(e) => {
                  e.preventDefault();
                  setParameters({
                    onstart: parameters.onstart,
                    onend: parameters.onend,
                    volume: parameters.volume,
                    rate: parameters.rate,
                    pitch: e.target.value,
                  });
                  handlePause();
                }}
                style={{ color: '#11A797', margin: '0 0.5rem' }}
                aria-label="Volume"
              />
              <AddIcon />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 1rem 1rem 0' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2vh' }}>Background&nbsp;</h2>
            <div style={{ width: '20vh', display: 'flex', justfyContent: 'center', alignItems: 'center', marginTop: '0.3rem' }}>
              <VolumeDown />
              <Slider
                style={{ color: '#11A797', margin: '0 0.5rem' }}
                aria-label="Background Volume"
                min={0}
                max={1}
                step={0.1}
                value={backgroundV}
                onChange={(e) => {
                  setBackgroundV(e.target.value);
                  handlePause();
                }}
              />
              <VolumeUp />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 1rem 1rem 0' }}>
            <h2 style={{ fontSize: '2vh' }} >Voice Options</h2>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={openVoice ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickVoiceOption}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorElVoice}
            open={openVoice}
            onClose={handleCloseVoiceOption}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              style: {
                maxHeight: '8vh',
                width: '16vh',
              },
            }}
          >
            {voiceOptions.map((option) => (
              <MenuItem key={option.name} selected={option.name === voice} onClick={() => setVoice(option.name)} sx={{ fontSize: '1.5vh' }}>
                {option.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </StyledModal>
    </div>
  )
};

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: '35vh',
  bgcolor: '#eaf4d2',
  border: '1px solid #000',
  p: 1,
  px: 1,
  pb: 1,
  'box-shadow': '0px 0px 3px 2px rgba(0, 0, 0, 0.5)',
  'border-radius': '5px 5px 5px',
};

const fontSizeOptions = [25, 50, 100, 125, 150, 175, 200];

export default Controls;