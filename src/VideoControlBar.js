import * as $ from 'jquery';
import * as _ from 'lodash';
import {ZenzaWatch} from './ZenzaWatchIndex';
import {CONSTANT} from './constant';
import {Storyboard} from './StoryBoard';
import {util} from './util';
import {Emitter} from './baselib';

//===BEGIN===

  class VideoControlBar extends Emitter {
    constructor(...args) {
      super();
      this.initialize(...args);
    }
  }
  VideoControlBar.BASE_HEIGHT = CONSTANT.CONTROL_BAR_HEIGHT;
  VideoControlBar.BASE_SEEKBAR_HEIGHT = 10;

  VideoControlBar.__css__ = (`
    .videoControlBar {
      position: fixed;
      bottom: 0;
      left: 0;
      transform: translate3d(0, 0, 0);
      width: 100vw;
      height: ${VideoControlBar.BASE_HEIGHT}px;
      z-index: 150000;
      background: #000;
      transition: opacity 0.3s ease, transform 0.3s ease;
      user-select: none;
      content: layout;
    }
    .zenzaScreenMode_small    .videoControlBar,
    .zenzaScreenMode_sideView .videoControlBar,
    .zenzaScreenMode_wide     .videoControlBar,
    .fullScreen               .videoControlBar {
      width: 100%; /* 100vwだと縦スクロールバーと被る */
    }

    .videoControlBar * {
      box-sizing: border-box;
      user-select: none;
    }

    .zenzaScreenMode_wide .videoControlBar,
    .fullScreen           .videoControlBar {
      position: absolute; /* firefoxのバグ対策 */
      opacity: 0;
      background: none;
    }

    .zenzaScreenMode_wide .volumeChanging .videoControlBar,
    .fullScreen           .volumeChanging .videoControlBar,
    .zenzaScreenMode_wide .is-mouseMoving .videoControlBar,
    .fullScreen           .is-mouseMoving .videoControlBar {
      opacity: 0.7;
      background: rgba(0, 0, 0, 0.5);
    }
    .zenzaScreenMode_wide .showVideoControlBar .videoControlBar,
    .fullScreen           .showVideoControlBar .videoControlBar {
      opacity: 1 !important;
      background: #000 !important;
    }


    .zenzaScreenMode_wide .videoControlBar.is-dragging,
    .fullScreen           .videoControlBar.is-dragging,
    .zenzaScreenMode_wide .videoControlBar:hover,
    .fullScreen           .videoControlBar:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.9);
    }

    .controlItemContainer {
      position: absolute;
      top: 10px;
      height: 40px;
      z-index: 200;
    }

    .controlItemContainer:hover,
    .videoControlBar.is-menuOpen .controlItemContainer {
      z-index: 260;
    }

    .controlItemContainer.left {
      left: 0;
      height: 40px;
      white-space: nowrap;
      overflow: visible;
      transition: transform 0.2s ease, left 0.2s ease;
    }
    .controlItemContainer.left .scalingUI {
      padding: 0 8px 0;
    }
    .controlItemContainer.left .scalingUI:empty {
      display: none;
    }
    .controlItemContainer.left .scalingUI>* {
      background: #222;
      display: inline-block;
    }
    .fullScreen .controlItemContainer.left {
      top: auto;
      transform-origin: top left;
    }


    .controlItemContainer.center {
      left: 50%;
      height: 40px;
      transform: translate(-50%, 0);
      background:
        linear-gradient(to bottom,
        transparent, transparent 4px, #222 0, #222 30px, transparent 0, transparent);
      white-space: nowrap;
      overflow: visible;
      transition: transform 0.2s ease, left 0.2s ease;
    }
    .fullScreen .controlItemContainer.center {
      top: auto;
    }
    .fullScreen.zenzaStoryboardOpen .controlItemContainer.center {
      background: transparent;
    }



    .controlItemContainer.center .scalingUI {
      transform-origin: top center;
    }

    .fullScreen.zenzaStoryboardOpen .controlItemContainer.center .scalingUI {
      background: rgba(32, 32, 32, 0.5);
    }
    .fullScreen.zenzaStoryboardOpen .controlItemContainer.center .scalingUI:hover {
      background: rgba(32, 32, 32, 0.8);
    }

    .controlItemContainer.right {
      right: 0;
    }
    .fullScreen .controlItemContainer.right {
      top: auto;
    }

    .is-mouseMoving .controlItemContainer.right .controlButton{
      background: #333;
    }
    .controlItemContainer.right .scalingUI {
      transform-origin: top right;
    }


    .controlButton {
      position: relative;
      display: inline-block;
      transition: opacity 0.4s ease;
      font-size: 20px;
      width: 32px;
      height: 32px;
      line-height: 30px;
      box-sizing: border-box;
      text-align: center;
      cursor: pointer;
      color: #fff;
      opacity: 0.8;
      margin-right: 8px;
      min-width: 32px;
      vertical-align: middle;      
    }
    .controlButton:hover {
      cursor: pointer;
      opacity: 1;
    }
    .controlButton:active .controlButtonInner {
      transform: translate(0, 2px);
    }

    .is-abort   .playControl,
    .is-error   .playControl,
    .is-loading .playControl {
      opacity: 0.4 !important;
      pointer-events: none;
    }


    .controlButton .tooltip {
      display: none;
      pointer-events: none;
      position: absolute;
      left: 16px;
      top: -30px;
      transform:  translate(-50%, 0);
      font-size: 12px;
      line-height: 16px;
      padding: 2px 4px;
      border: 1px solid #000;
      background: #ffc;
      color: #000;
      text-shadow: none;
      white-space: nowrap;
      z-index: 100;
      opacity: 0.8;
    }
    .is-mouseMoving .controlButton:hover .tooltip {
      display: block;
      opacity: 1;
    }
    .videoControlBar:hover .controlButton {
      opacity: 1;
      pointer-events: auto;
    }

    .settingPanelSwitch {
      width: 32px;
    }
    .settingPanelSwitch:hover {
      text-shadow: 0 0 8px #ff9;
    }
    .settingPanelSwitch .tooltip {
      left: 0;
    }


    .controlButtonInner {
      display: inline-block;
    }


    .seekTop {
      left: 0px;
      width: 32px;
      transform: scale(1.1);
    }

    .togglePlay {
      width: 36px;
      transition: transform 0.2s ease;
      transform: scale(1.1);
    }
    .togglePlay:active {
      transform: scale(0.75);
    }

    .togglePlay .play,
    .togglePlay .pause {
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transition: transform 0.1s linear, opacity 0.1s linear;
      user-select: none;
      pointer-events: none;
    }
    .togglePlay .play {
      width: 100%;
      height: 100%;
      transform: scale(1.2) translate(-50%, -50%) translate(10%, 10%);
    }
    .is-playing .togglePlay .play {
      opacity: 0;
    }
    .togglePlay>.pause {
      width: 24px;
      height: 16px;
      background-image: linear-gradient(
        to right, 
        transparent 0, transparent 12.5%, 
        currentColor 0, currentColor 43.75%, 
        transparent 0, transparent 56.25%, 
        currentColor 0, currentColor 87.5%, 
        transparent 0);
      opacity: 0;
      transform: scaleX(0);
    }
    .is-playing .togglePlay>.pause {
      opacity: 1;
      transform: translate(-50%, -50%);
    }

    .seekBarContainer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      cursor: pointer;
      z-index: 250;
    }
    .fullScreen .seekBarContainer {
      top: auto;
      bottom: 0;
      z-index: 300;
    }

    /* 見えないマウス判定 */
    .seekBarContainer .seekBarShadow {
      position: absolute;
      background: transparent;
      opacity: 0;
      width: 100vw;
      height: 8px;
      top: -8px;
    }
    .is-mouseMoving .seekBarContainer:hover .seekBarShadow {
      height: 48px;
      top: -48px;
    }

    .fullScreen .seekBarContainer:hover .seekBarShadow {
      height: 14px;
      top: -12px;
    }

    .is-abort   .seekBarContainer,
    .is-loading .seekBarContainer,
    .is-error   .seekBarContainer {
      pointer-events: none;
    }
    .is-abort   .seekBarContainer *,
    .is-error   .seekBarContainer * {
      display: none;
    }

    .seekBar {
      position: relative;
      width: 100%;
      height: 10px;
      margin: 2px 0 2px;
      border-top:    1px solid #333;
      border-bottom: 1px solid #333;
      cursor: pointer;
      transition: height 0.2s ease 1s, margin-top 0.2s ease 1s;
    }

    .seekBar:hover {
      height: 24px;
      margin-top: -14px;
      transition: none;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .fullScreen .seekBar {
      margin-top: 0px;
      margin-bottom: -14px;
      height: 24px;
      transition: none;
    }

    .seekBarContainer .seekBar * {
      pointer-events: none;
    }

    .bufferRange {
      position: absolute;
      width: 100%;
      height: 110%;
      left: 0px;
      top: 0px;
      box-shadow: 0 0 6px #ff9 inset, 0 0 4px #ff9;
      z-index: 190;
      background: #ff9;
      transform-origin: left;
      transform: translate3d(0, 0, 0) scaleX(0);
      transition: transform 0.2s;
      mix-blend-mode: overlay;
      opacity: 0.6;
    }

    .is-youTube .bufferRange {
      width: 100% !important;
      height: 110% !important;
      background: #f99;
      transition: transform 0.5s ease 1s;
      transform: translate3d(0, 0, 0) scaleX(1) !important;
    }

    .seekBarPointer {
      position: absolute;
      display: inline-block;
      top: 50%;
      left: 0;
      width: 12px;
      background: rgba(255, 255, 255, 0.7);
      height: calc(100% + 2px);
      z-index: 200;
      box-shadow: 0 0 4px #ffc inset;
      pointer-events: none;
      transform: translate3d(-6px, -50%, 0);
      mix-blend-mode: lighten;
    }

    .is-loading .seekBarPointer {
      display: none !important;
    }
    
    .is-dragging .seekBarPointer.is-notSmooth {
      transition: none;
    }

    @keyframes seekBarPointerMove {
      0%   { transform: translate3d(-6px, -50%, 0) translate3d(0, 0, 0); }
      100% { transform: translate3d(-6px, -50%, 0) translate3d(100vw, 0, 0); }
    }

    .videoControlBar .videoTime {
      display: inline-flex;
      top: 0;
      padding: 0;
      color: #fff;
      font-size: 12px;
      white-space: nowrap;
      vertical-align: middle;
      background: rgba(33, 33, 33, 0.5);
      border: 0;
      pointer-events: none;
      user-select: none;
    }
    
    .videoControlBar .videoTime .currentTime,
    .videoControlBar .videoTime .duration {
      display: inline-block;
      color: #fff;
      text-align: center;
      background: inherit;
      border: 0;
      width: 44px;
      font-family: 'Yu Gothic', 'YuGothic', 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace;
    }

    .videoControlBar.is-loading .videoTime {
      display: none;
    }

    .seekBarContainer .tooltip {
      position: absolute;
      padding: 1px;
      bottom: 12px;
      left: 0;
      transform: translate(-50%, 0);
      white-space: nowrap;
      font-size: 10px;
      opacity: 0;
      border: 1px solid #000;
      background: #fff;
      color: #000;
      z-index: 150;
    }

    .is-dragging .seekBarContainer .tooltip,
    .seekBarContainer:hover .tooltip {
      opacity: 0.8;
    }
    
    .resumePointer {
      position: absolute;
      mix-blend-mode: color-dodge;
      top: 0;
      z-index: 200;
    }

    .zenzaHeatMap {
      position: absolute;
      pointer-events: none;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      transform-origin: 0 0 0;
      transform: translateZ(0);
      opacity: 0.5;
      z-index: 110;
    }
    .noHeatMap .zenzaHeatMap {
      display: none;
    }

    .loopSwitch {
      width:  32px;
      height: 32px;
      line-height: 30px;
      font-size: 20px;
      color: #888;
    }
    .loopSwitch:active {
      font-size: 15px;
    }

    .is-loop .loopSwitch {
      color: var(--enabled-button-color);
    }
    .loopSwitch .controlButtonInner {
      font-family: STIXGeneral;
    }

    .playbackRateMenu {
      bottom: 0;
      width: auto;
      min-width: 40px;
      height:    32px;
      line-height: 30px;
      font-size: 18px;
      white-space: nowrap;
      margin-right: 0;
    }

    .playbackRateMenu:active .controlButtonInner {
      transform: translate(0, 2px);
    }
    .playbackRateMenu.show {
      background: #888;
    }
    .playbackRateMenu.show .tooltip {
      display: none;
    }


    .playbackRateSelectMenu {
      bottom: 44px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 180px;
      text-align: left;
      line-height: 20px;
      font-size: 18px !important;
    }

    .playbackRateSelectMenu ul {
      margin: 2px 8px;
    }

    .playbackRateSelectMenu .triangle {
      transform: translate(-50%, 0) rotate(-45deg);
      bottom: -9px;
      left: 50%;
    }

    .playbackRateSelectMenu li {
      padding: 3px 4px;
    }

    .screenModeMenu {
      width:  32px;
      height: 32px;
      line-height: 30px;
      font-size: 20px;
    }
    .screenModeMenu:active {
      font-size: 15px;
    }


    .screenModeMenu.show {
      background: #888;
    }
    .screenModeMenu.show .tooltip {
      display: none;
    }

    .screenModeMenu:active {
      font-size: 10px;
    }


    .fullScreen .screenModeMenu {
      display: none;
    }

    .screenModeSelectMenu {
      left: 50%;
      transform: translate(-50%, 0);
      bottom: 44px;
      width: 148px;
      padding: 2px 4px;
      font-size: 12px;
      line-height: 15px;
    }

    .changeScreenMode .screenModeSelectMenu,
    .fullScreen       .screenModeSelectMenu {
      display: none;
    }

    .screenModeSelectMenu .triangle {
      transform: translate(-50%, 0) rotate(-45deg);
      bottom: -8.5px;
      left: 50%;
    }

    .screenModeSelectMenu ul li {
      display: inline-block;
      text-align: center;
      border-bottom: none;
      margin: 0;
      padding: 0;
    }
    .screenModeSelectMenu ul li span {
      border: 1px solid #ccc;
      width: 50px;
      margin: 2px 8px;
      padding: 4px 0;
    }

    .zenzaScreenMode_3D       .screenModeSelectMenu li.mode3D span,
    .zenzaScreenMode_sideView .screenModeSelectMenu li.sideView span,
    .zenzaScreenMode_small    .screenModeSelectMenu li.small span,
    .zenzaScreenMode_normal   .screenModeSelectMenu li.normal span,
    .zenzaScreenMode_big      .screenModeSelectMenu li.big span,
    .zenzaScreenMode_wide     .screenModeSelectMenu li.wide span {
      color: #ff9;
      border-color: #ff0;
    }


             .fullScreen  .fullScreenSwitch .controlButtonInner .toFull,
    body:not(.fullScreen) .fullScreenSwitch .controlButtonInner .returnFull {
      display: none;
    }


    .videoControlBar .muteSwitch {
      margin-right: 0;
    }
    .videoControlBar .muteSwitch:active {
      font-size: 15px;
    }

    .zenzaPlayerContainer:not(.is-mute) .muteSwitch .mute-on,
                              .is-mute  .muteSwitch .mute-off {
      display: none;
    }

    .videoControlBar .volumeControl {
      display: inline-block;
      width: 64px;
      height: 8px;
      position: relative;
      vertical-align: middle;
      margin-right: 16px;
      --back-color: #333;
      --fore-color: #ccc;
      background-color: var(--back-color);
    }
    .is-mute .videoControlBar .volumeControl  {
      pointer-events: none;
      background-image: unset !important;
    }

    .videoControlBar .volumeControl .tooltip {
      display: none;
      pointer-events: none;
      position: absolute;
      left: 6px;
      top: -24px;
      font-size: 12px;
      line-height: 16px;
      padding: 2px 4px;
      border: 1px solid #000;
      background: #ffc;
      color: black;
      text-shadow: none;
      white-space: nowrap;
      z-index: 100;
    }
    .videoControlBar .volumeControl:hover .tooltip {
      display: block;
    }


    .prevVideo.playControl,
    .nextVideo.playControl {
      display: none;
    }
    .is-playlistEnable .prevVideo.playControl,
    .is-playlistEnable .nextVideo.playControl {
      display: inline-block;
    }

    .prevVideo,
    .nextVideo {
      font-size: 23px;
    }
    .prevVideo .controlButtonInner {
      transform: scaleX(-1);
    }

    .toggleStoryboard {
      visibility: hidden;
      pointer-events: none;
    }
    .storyboardAvailable .toggleStoryboard {
      visibility: visible;
      pointer-events: auto;
    }
    .zenzaStoryboardOpen .storyboardAvailable .toggleStoryboard {
      color: var(--enabled-button-color);
    }

    .toggleStoryboard .controlButtonInner {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 50%;
      border-radius: 75% 16%;
      border: 1px solid;
      transform: translate(-50%, -50%) rotate(45deg);
      pointer-events: none;
      background: 
        radial-gradient(
          currentColor,
          currentColor 6px, 
          transparent 0
        );
    }
    .toggleStoryboard:active .controlButtonInner {
      transform: translate(-50%, -50%) scaleY(0.1) rotate(45deg);
    }

    .toggleStoryboard:active {
      transform: scale(0.75);
    }



    .videoServerTypeMenu {
      bottom: 0;
      min-width: 40px;
      height:    32px;
      line-height: 30px;
      font-size: 16px;
      white-space: nowrap;
    }
    .videoServerTypeMenu.is-dmc-playing  {
      text-shadow:
        0px 0px 8px var(--enabled-button-color), 
        0px 0px 6px var(--enabled-button-color), 
        0px 0px 4px var(--enabled-button-color),
        0px 0px 2px var(--enabled-button-color);
    }
    .is-mouseMoving .videoServerTypeMenu.is-dmc-playing {
      background: #336;
    }
    .is-youTube .videoServerTypeMenu {
      text-shadow:
        0px 0px 8px #fc9, 0px 0px 6px #fc9, 0px 0px 4px #fc9, 0px 0px 2px #fc9 !important;
    }
    .is-youTube .videoServerTypeMenu:not(.forYouTube),
    .videoServerTypeMenu.forYouTube {
      display: none;
    }
    .is-youTube .videoServerTypeMenu.forYouTube {
      display: inline-block;
    }


    .videoServerTypeMenu:active {
      font-size: 13px;
    }
    .videoServerTypeMenu.show {
      background: #888;
    }
    .videoServerTypeMenu.show .tooltip {
      display: none;
    }


    .videoServerTypeSelectMenu  {
      bottom: 44px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 180px;
      text-align: left;
      line-height: 20px;
      font-size: 16px !important;
      text-shadow: none !important;
      cursor: default;
    }

    .videoServerTypeSelectMenu ul {
      margin: 2px 8px;
    }

    .videoServerTypeSelectMenu .triangle {
      transform: translate(-50%, 0) rotate(-45deg);
      bottom: -9px;
      left: 50%;
    }

    .videoServerTypeSelectMenu li {
      padding: 3px 4px;
    }

    .videoServerTypeSelectMenu li.selected {
      pointer-events: none;
      text-shadow: 0 0 4px #99f, 0 0 8px #99f !important;
    }

    .videoServerTypeSelectMenu .smileVideoQuality,
    .videoServerTypeSelectMenu .dmcVideoQuality {
      font-size: 80%;
      padding-left: 28px;
    }

    .videoServerTypeSelectMenu .currentVideoQuality {
      color: #ccf;
      font-size: 80%;
      text-align: center;
    }

    .videoServerTypeSelectMenu .dmcVideoQuality.selected     span:before,
    .videoServerTypeSelectMenu .smileVideoQuality.selected   span:before {
      left: 22px;
      font-size: 80%;
    }

    .videoServerTypeSelectMenu .currentVideoQuality.selected   span:before {
      display: none;
    }

    /* dmcを使用不能の時はdmc選択とdmc画質選択を薄く */
    .zenzaPlayerContainer:not(.is-dmcAvailable) .serverType.select-server-dmc,
    .zenzaPlayerContainer:not(.is-dmcAvailable) .dmcVideoQuality,
    .zenzaPlayerContainer:not(.is-dmcAvailable) .currentVideoQuality {
      opacity: 0.4;
      pointer-events: none;
      text-shadow: none !important;
    }
    .zenzaPlayerContainer:not(.is-dmcAvailable) .currentVideoQuality {
      display: none;
    }
    .zenzaPlayerContainer:not(.is-dmcAvailable) .serverType.select-server-dmc span:before,
    .zenzaPlayerContainer:not(.is-dmcAvailable) .dmcVideoQuality       span:before{
      display: none !important;
    }
    .zenzaPlayerContainer:not(.is-dmcAvailable) .serverType {
      pointer-events: none;
    }


    /* dmcを使用している時はsmileの画質選択を薄く */
    .is-dmc-playing .smileVideoQuality {
      display: none;
     }

    /* dmcを選択していない状態ではdmcの画質選択を隠す */
    .is-smile-playing .currentVideoQuality,
    .is-smile-playing .dmcVideoQuality {
      display: none;
    }



    @media screen and (max-width: 864px) {
      .controlItemContainer.center {
        left: 0%;
        transform: translate(0, 0);
      }
    }

    .ZenzaWatchVer {
      display: none;
    }
    .ZenzaWatchVer[data-env="DEV"] {
      display: inline-block;
      color: #999;
      position: absolute;
      right: 0;
      background: transparent !important;
      transform: translate(100%, 0);
      font-size: 12px;
      line-height: 32px;
      pointer-events: none;
    }
    
    .progressWave {
      display: none;
    }
    .is-stalled .progressWave,
    .is-loading .progressWave {
      display: inline-block;
      position: absolute;
      left: 0;
      top: 1px;
      z-index: 400;
      width: 40%;
      height: calc(100% - 2px);
      background: linear-gradient(
        to right,
        rgba(0,0,0,0),
        ${util.toRgba('#ffffcc', 0.3)},
        rgba(0,0,0)
      );
      mix-blend-mode: lighten;
      animation-name: progressWave;
      animation-iteration-count: infinite;
      animation-duration: 4s;
      animation-timing-function: linear;
      animation-delay: -1s;
    }
    @keyframes progressWave {
      0%   { transform: translate3d(-100%, 0, 0) translate3d(-5vw, 0, 0); }
      100% { transform: translate3d(100%, 0, 0) translate3d(150vw, 0, 0); }
    }
    .is-seeking .progressWave {
      display: none;
    }

  `).trim();

  VideoControlBar.__tpl__ = (`
    <div class="videoControlBar" data-command="nop">

      <div class="seekBarContainer">
        <div class="seekBarShadow"></div>
        <div class="seekBar">
          <div class="seekBarPointer"></div>
          <div class="bufferRange"></div>
          <div class="progressWave"></div>
        </div>
        <zenza-seekbar-label class="resumePointer" data-command="seekTo" data-text="ここまで見た">
        </zenza-seekbar-label>
      </div>

      <div class="controlItemContainer left">
        <div class="scalingUI">
          <div class="ZenzaWatchVer" data-env="${ZenzaWatch.env}">ver ${ZenzaWatch.version}${ZenzaWatch.env === 'DEV' ? '(Dev)' : ''}</div>
        </div>
      </div>
      <div class="controlItemContainer center">
        <div class="scalingUI">
          <div class="toggleStoryboard controlButton playControl forPremium" data-command="toggleStoryboard">
            <div class="controlButtonInner"></div>
            <div class="tooltip">シーンサーチ</div>
          </div>

          <div class="loopSwitch controlButton playControl" data-command="toggle-loop">
            <div class="controlButtonInner">&#8635;</div>
            <div class="tooltip">リピート</div>
          </div>

           <div class="seekTop controlButton playControl" data-command="seek" data-param="0">
            <div class="controlButtonInner">&#8676;<!-- &#x23EE; --><!--&#9475;&#9666;&#9666;--></div>
            <div class="tooltip">先頭</div>
          </div>

          <div class="togglePlay controlButton playControl" data-command="togglePlay">
            <span class="pause"></span>
            <span class="play">▶</span>
          </div>

          <div class="playbackRateMenu controlButton" data-command="playbackRateMenu">
            <div class="controlButtonInner">x1</div>
            <div class="tooltip">再生速度</div>
            <div class="playbackRateSelectMenu zenzaPopupMenu">
              <div class="triangle"></div>
              <p class="caption">再生速度</p>
              <ul>
                <li class="playbackRate" data-command="playbackRate" data-param="10"><span>10倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="5"  ><span>5倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="4"  ><span>4倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="3"  ><span>3倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="2"  ><span>2倍</span></li>

                <li class="playbackRate" data-command="playbackRate" data-param="1.75"><span>1.75倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="1.5"><span>1.5倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="1.25"><span>1.25倍</span></li>

                <li class="playbackRate" data-command="playbackRate" data-param="1.0"><span>標準速度(x1)</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="0.75"><span>0.75倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="0.5"><span>0.5倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="0.25"><span>0.25倍</span></li>
                <li class="playbackRate" data-command="playbackRate" data-param="0.1"><span>0.1倍</span></li>
              </ul>
            </div>
          </div>

          <div class="videoTime">
            <input type="text" class="currentTime" value="00:00">/<input type="text" class="duration" value="00:00">
          </div>

          <div class="muteSwitch controlButton" data-command="toggle-mute">
            <div class="tooltip">ミュート(M)</div>
            <div class="menuButtonInner mute-off">&#x1F50A;</div>
            <div class="menuButtonInner mute-on">&#x1F507;</div>
          </div>

          <div class="volumeControl">
            <div class="tooltip">音量調整</div>
          </div>

           <div class="prevVideo controlButton playControl" data-command="playPreviousVideo" data-param="0">
            <div class="controlButtonInner">&#x27A0;</div>
            <div class="tooltip">前の動画</div>
          </div>

           <div class="nextVideo controlButton playControl" data-command="playNextVideo" data-param="0">
            <div class="controlButtonInner">&#x27A0;</div>
            <div class="tooltip">次の動画</div>
          </div>


        </div>
      </div>

      <div class="controlItemContainer right">

        <div class="scalingUI">

          <div class="videoServerTypeMenu controlButton forYouTube" data-command="reload" title="ZenTube解除">
            <div class="controlButtonInner">画</div>
          </div>
          <div class="videoServerTypeMenu controlButton " data-command="videoServerTypeMenu">
            <div class="controlButtonInner">画</div>

            <div class="tooltip">動画サーバー・画質</div>
            <div class="videoServerTypeSelectMenu zenzaPopupMenu">
              <div class="triangle"></div>
              <p class="caption">動画サーバー・画質</p>
              <ul>

                <li class="serverType select-server-dmc" data-command="update-videoServerType" data-param="dmc">
                  <span>新システムを使用</span>
                  <p class="currentVideoQuality"></p>
                </li>


                <li class="dmcVideoQuality selected select-dmc-auto" data-command="update-dmcVideoQuality" data-param="auto"><span>自動(auto)</span></li>
                <li class="dmcVideoQuality selected select-dmc-veryhigh" data-command="update-dmcVideoQuality" data-param="veryhigh"><span>超(1080) 優先</span></li>
                <li class="dmcVideoQuality selected select-dmc-high" data-command="update-dmcVideoQuality" data-param="high"><span>高(720) 優先</span></li>
                <li class="dmcVideoQuality selected select-dmc-mid"  data-command="update-dmcVideoQuality" data-param="mid"><span>中(480-540)</span></li>
                <li class="dmcVideoQuality selected select-dmc-low"  data-command="update-dmcVideoQuality" data-param="low"><span>低(360)</span></li>

                <li class="serverType select-server-smile" data-command="update-videoServerType" data-param="smile">
                  <span>旧システムを使用</span>
                </li>
                <li class="smileVideoQuality select-smile-default" data-command="update-forceEconomy" data-param="false" data-type="bool"><span>自動</span></li>
                <li class="smileVideoQuality select-smile-economy" data-command="update-forceEconomy" data-param="true"  data-type="bool"><span>エコノミー固定</span></li>
             </ul>
            </div>
          </div>

          <div class="screenModeMenu controlButton" data-command="screenModeMenu">
            <div class="tooltip">画面サイズ・モード変更</div>
            <div class="controlButtonInner">&#9114;</div>
            <div class="screenModeSelectMenu zenzaPopupMenu">
              <div class="triangle"></div>
              <p class="caption">画面モード</p>
              <ul>
                <li class="screenMode mode3D"   data-command="screenMode" data-param="3D"><span>3D</span></li>
                <li class="screenMode small"    data-command="screenMode" data-param="small"><span>小</span></li>
                <li class="screenMode sideView" data-command="screenMode" data-param="sideView"><span>横</span></li>
                <li class="screenMode normal"   data-command="screenMode" data-param="normal"><span>中</span></li>
                <li class="screenMode wide"     data-command="screenMode" data-param="wide"><span>WIDE</span></li>
                <li class="screenMode big"      data-command="screenMode" data-param="big"><span>大</span></li>
              </ul>
            </div>
          </div>

          <div class="fullScreenSwitch controlButton" data-command="fullScreen">
            <div class="tooltip">フルスクリーン(F)</div>
            <div class="controlButtonInner">
              <!-- TODO: YouTubeと同じにする -->
              <span class="toFull">&#8690;</span>
              <span class="returnFull">&#8689;</span>
            </div>
          </div>

          <div class="settingPanelSwitch controlButton" data-command="settingPanel">
            <div class="controlButtonInner">&#x2699;</div>
            <div class="tooltip">設定</div>
          </div>

        </div>
      </div>

    </div>
  `).trim();

  _.assign(VideoControlBar.prototype, {
    initialize: function(params) {
      this._playerConfig        = params.playerConfig;
      this._$playerContainer    = params.$playerContainer;
      this._playerState         = params.playerState;
      let player = this._player = params.player;

      player.on('open',           this._onPlayerOpen.bind(this));
      player.on('canPlay',        this._onPlayerCanPlay.bind(this));
      player.on('durationChange', this._onPlayerDurationChange.bind(this));
      player.on('close',          this._onPlayerClose.bind(this));
      player.on('progress',       this._onPlayerProgress.bind(this));
      player.on('loadVideoInfo',  this._onLoadVideoInfo.bind(this));
      player.on('commentParsed',  _.debounce(this._onCommentParsed.bind(this), 500));
      player.on('commentChange',  _.debounce(this._onCommentChange.bind(this), 100));

      this._initializeDom();
      this._initializeScreenModeSelectMenu();
      this._initializePlaybackRateSelectMenu();
      this._initializeVolumeControl();
      this._initializeVideoServerTypeSelectMenu();
      this._isFirstVideoInitialized = false;

      ZenzaWatch.debug.videoControlBar = this;
    },
    _initializeDom: function() {
      util.addStyle(VideoControlBar.__css__);
      let $view = this._$view = $(VideoControlBar.__tpl__);
      let $container = this._$playerContainer;
      let config = this._playerConfig;

      this._$seekBarContainer = $view.find('.seekBarContainer');
      this._$seekBar          = $view.find('.seekBar');
      this._pointer         = new SmoothSeekBarPointer({
        pointer: $view.find('.seekBarPointer')[0],
        playerState: this._playerState
      });
      this._bufferRange    = $view.find('.bufferRange')[0];

      this._$seekBar
        .on('mousedown', this._onSeekBarMouseDown.bind(this))
        .on('mousemove', this._onSeekBarMouseMove.bind(this))
        .on('mousemove', _.debounce(this._onSeekBarMouseMoveEnd.bind(this), 1000));

      $view.on('click', this._onClick.bind(this));
      this._$view[0].addEventListener('command', this._onCommandEvent.bind(this));

      this._$currentTime = $view.find('.currentTime');
      this._$duration    = $view.find('.duration');

      this._resumePointer = $view.find('zenza-seekbar-label')[0];

      this._heatMap = new HeatMap({
        $container: this._$seekBarContainer.find('.seekBar')
      });
      let updateHeatMapVisibility = v => {
        this._$seekBarContainer.toggleClass('noHeatMap', !v);
      };
      updateHeatMapVisibility(this._playerConfig.getValue('enableHeatMap'));
      this._playerConfig.on('update-enableHeatMap', updateHeatMapVisibility);

      this._storyboard = new Storyboard({
        playerConfig: config,
        player: this._player,
        $container: $view
      });

      this._seekBarToolTip = new SeekBarToolTip({
        $container: this._$seekBarContainer,
        storyboard: this._storyboard
      });

      this._commentPreview = new CommentPreview({
        $container: this._$seekBarContainer
      });
      let updateEnableCommentPreview = v => {
        this._$seekBarContainer.toggleClass('enableCommentPreview', v);
        this._commentPreview.setIsEnable(v);
      };

      updateEnableCommentPreview(config.getValue('enableCommentPreview'));
      config.on('update-enableCommentPreview', updateEnableCommentPreview);

      this._$screenModeMenu       = $view.find('.screenModeMenu');
      this._$screenModeSelectMenu = $view.find('.screenModeSelectMenu');

      this._$playbackRateMenu       = $view.find('.playbackRateMenu');
      this._$playbackRateSelectMenu = $view.find('.playbackRateSelectMenu');

      this._$videoServerTypeMenu       = $view.find('.videoServerTypeMenu');
      this._$videoServerTypeSelectMenu = $view.find('.videoServerTypeSelectMenu');


      ZenzaWatch.emitter.on('hideHover', () => {
        this._hideMenu();
        this._commentPreview.hide();
      });

      $container.append($view);
      this._width = this._$seekBarContainer.innerWidth();
    },
    _initializeScreenModeSelectMenu: function() {
    },
    _initializePlaybackRateSelectMenu: function() {
      let config = this._playerConfig;
      let $btn  = this._$playbackRateMenu;
      let $label = $btn.find('.controlButtonInner');
      let $menu = this._$playbackRateSelectMenu;

      let updatePlaybackRate =  rate => {
        $label.text(`x${rate}`);
        $menu.find('.selected').removeClass('selected');
        let fr = Math.floor( parseFloat(rate, 10) * 100) / 100;
        $menu.find('.playbackRate').each((i, item) => {
          let r = parseFloat(item.getAttribute('data-param'), 10);
          if (fr === r) {
            item.classList.add('selected');
          }
        });
        this._pointer.playbackRate = rate;
      };

      updatePlaybackRate(config.getValue('playbackRate'));
      config.on('update-playbackRate', updatePlaybackRate);
    },
    _initializeVolumeControl: function() {
      let $container = this._$view.find('.volumeControl');
      let $tooltip = $container.find('.tooltip');
      let $body    = $('body');
      let $window  = $(window);
      let config   = this._playerConfig;

      let setVolumeBar = this._setVolumeBar = v => {
        let per = `${Math.round(v * 100)}%`;
        $container.css('background-image',
          `linear-gradient(to right, var(--fore-color),  var(--fore-color) ${per},  var(--back-color) 0,  var(--back-color))`);
        $tooltip.text(`音量 (${per})`);
      };

      let posToVol = x => {
        let width = $container.outerWidth();
        let vol = x / width;
        return Math.max(0, Math.min(vol, 1.0));
      };

      let onBodyMouseMove = e => {
        let offset = $container.offset();
        let scale = Math.max(0.1, parseFloat(config.getValue('menuScale'), 10));
        let left = (e.clientX - offset.left) / scale;
        let vol = posToVol(left);

        util.dispatchCommand(e.target, 'volume', vol);
      };

      let bindDragEvent = () => {
        let unbindDragEvent = () => {
          $body
            .off('mousemove.ZenzaWatchVolumeBar')
            .off('mouseup.ZenzaWatchVolumeBar');
          $window.off('blur.ZenzaWatchVolumeBar');
        };

        $body
          .on('mousemove.ZenzaWatchVolumeBar', onBodyMouseMove)
          .on('mouseup.ZenzaWatchVolumeBar',   unbindDragEvent);
        $window.on('blur.ZenzaWatchVolumeBar', unbindDragEvent);
      };

      let onVolumeBarMouseDown = e => {
        e.preventDefault();
        e.stopPropagation();

        util.dispatchCommand(e.target, 'volume', posToVol(e.offsetX));

        bindDragEvent();
      };
      $container.on('mousedown', onVolumeBarMouseDown);

      setVolumeBar(this._playerConfig.getValue('volume'));
      this._playerConfig.on('update-volume', setVolumeBar);
    },
    _initializeVideoServerTypeSelectMenu: function() {
      const config = this._playerConfig;
      const $button = this._$videoServerTypeMenu;
      const $select  = this._$videoServerTypeSelectMenu;
      const $current = $select.find('.currentVideoQuality');

      const updateSmileVideoQuality = value => {
        const $dq = $select.find('.smileVideoQuality');
        $dq.removeClass('selected');
        $select.find('.select-smile-' + (value === 'eco' ? 'economy' : 'default')).addClass('selected');
      };

      const updateDmcVideoQuality = value => {
        const $dq = $select.find('.dmcVideoQuality');
        $dq.removeClass('selected');
        $select.find('.select-dmc-' + value).addClass('selected');
      };

      const onVideoServerType = (type, videoSessionInfo) => {
        $button.removeClass('is-smile-playing is-dmc-playing')
          .addClass(`is-${type === 'dmc' ? 'dmc' : 'smile'}-playing`);
        $select.find('.serverType').removeClass('selected');
        $select.find(`.select-server-${type === 'dmc' ? 'dmc' : 'smile'}`).addClass('selected');
        $current.text(type !== 'dmc' ? '----' : videoSessionInfo.videoFormat.replace(/^.*h264_/, ''));
      };

      updateSmileVideoQuality(   config.getValue('smileVideoQuality'));
      updateDmcVideoQuality(config.getValue('dmcVideoQuality'));
      config.on('update-forceEconomy',    updateSmileVideoQuality);
      config.on('update-dmcVideoQuality', updateDmcVideoQuality);

      this._player.on('videoServerType', onVideoServerType);
    },
    _onCommandEvent: function(e) {
      const command = e.detail.command;
      switch (command) {
        case 'screenModeMenu':
          this.toggleScreenModeMenu();
          break;
        case 'playbackRateMenu':
          this.togglePlaybackRateMenu();
          break;
        case 'toggleStoryboard':
          this._storyboard.toggle();
          break;
        case 'videoServerTypeMenu':
          this.toggleVideoServerTypeMenu();
          break;
        default:
          return;
      }
      e.stopPropagation();
    },
    _onClick: function(e) {
      e.preventDefault();

      let target = e.target.closest('[data-command]');
      if (!target) {
        return;
      }
      let command = target.dataset.command;
      let param   = target.dataset.param;
      let type    = target.dataset.type;
      if (param && (type === 'bool' || type === 'json')) {
        param = JSON.parse(param);
      }
      switch (command) {
        case 'screenModeMenu':
          this.toggleScreenModeMenu();
          break;
        case 'playbackRateMenu':
          this.togglePlaybackRateMenu();
          break;
        case 'toggleStoryboard':
          this._storyboard.toggle();
          break;
        case 'videoServerTypeMenu':
          this.toggleVideoServerTypeMenu();
          break;
        default:
          util.dispatchCommand(target, command, param);
          break;
       }
      e.stopPropagation();
    },
    _hideMenu: function() {
      [ 'toggleScreenModeMenu',
        'togglePlaybackRateMenu',
        'toggleVideoServerTypeMenu'
      ].forEach(func => this[func](false));
    },
    togglePlaybackRateMenu: function(v) {
      let $btn  = this._$playbackRateMenu;
      let $menu = this._$playbackRateSelectMenu;
      this._toggleMenu('playbackRate', $btn, $menu, v);
    },
    toggleScreenModeMenu: function(v) {
      let $btn  = this._$screenModeMenu;
      let $menu = this._$screenModeSelectMenu;
      this._toggleMenu('screenMode', $btn, $menu, v);
    },
    toggleVideoServerTypeMenu: function(v) {
      let $btn  = this._$videoServerTypeMenu;
      let $menu = this._$videoServerTypeSelectMenu;
      this._toggleMenu('screenMode', $btn, $menu, v);
    },
    _toggleMenu: function(name, $btn, $menu, v) {
      let $body = $('body');
      let eventName = `click.ZenzaWatch_${name}Menu`;

      $body.off(eventName);
      $btn .toggleClass('show', v);
      $menu.toggleClass('show', v);

      let onBodyClick = () => {
        $btn.removeClass('show');
        $menu.removeClass('show');
        $body.off(eventName);
        ZenzaWatch.emitter.emitAsync('hideMenu');
      };
      if ($menu.hasClass('show')) {
        this._hideMenu();
        $btn .addClass('show');
        $menu.addClass('show');
        $body.on(eventName, onBodyClick);
        ZenzaWatch.emitter.emitAsync('showMenu');
      }
      this._$view.toggleClass('is-menuOpen', $menu.hasClass('show'));
    },
    _posToTime: function(pos) {
      let width = this._$seekBar.innerWidth();
      return this._duration * (pos / Math.max(width, 1));
    },
    _timeToPos: function(time) {
      return this._width * (time / Math.max(this._duration, 1));
    },
    _timeToPer: function(time) {
      return (time / Math.max(this._duration, 1)) * 100;
    },
    _onPlayerOpen: function() {
      this._startTimer();
      this.setDuration(0);
      this.setCurrentTime(0);
      this._heatMap.reset();
      this._storyboard.reset();
      this.resetBufferedRange();
    },
    _onPlayerCanPlay: function(watchId, videoInfo) {
      let duration = this._player.getDuration();
      this.setDuration(duration);
      this._storyboard.onVideoCanPlay(watchId, videoInfo);

      this._heatMap.setDuration(duration);
    },
    _onCommentParsed: function() {
      this._chatList = this._player.getChatList();
      this._heatMap.setChatList(this._chatList);
      this._commentPreview.setChatList(this._chatList);
    },
    _onCommentChange: function() {
      this._chatList = this._player.getChatList();
      this._heatMap.setChatList(this._chatList);
      this._commentPreview.setChatList(this._chatList);
    },
    _onPlayerDurationChange: function() {
      this._pointer.duration = this._playerState.videoInfo.duration;
      this._heatMap.setChatList(this._chatList);
    },
    _onPlayerClose: function() {
      this._stopTimer();
    },
    _onPlayerProgress: function(range, currentTime) {
      this.setBufferedRange(range, currentTime);
    },
    _startTimer: function() {
      this._timerCount = 0;
      this._timer = window.setInterval(this._onTimer.bind(this), 100);
    },
    _stopTimer: function() {
      if (this._timer) {
        window.clearInterval(this._timer);
        this._timer = null;
      }
    },
    _onSeekBarMouseDown: function(e) {
      e.preventDefault();
      e.stopPropagation();

      let left = e.offsetX;
      let sec = this._posToTime(left);

      util.dispatchCommand(e.target, 'seek', sec);

      this._beginMouseDrag();
    },
    _onSeekBarMouseMove: function(e) {
      if (!this._$view.hasClass('is-dragging')) {
        e.stopPropagation();
      }
      let left = e.offsetX;
      let sec = this._posToTime(left);
      this._seekBarMouseX = left;

      this._commentPreview.setCurrentTime(sec);
      this._commentPreview.show(left);

      this._seekBarToolTip.update(sec, left);
    },
    _onSeekBarMouseMoveEnd: function(e) {
    },
    _beginMouseDrag: function() {
      this._bindDragEvent();
      this._$view.addClass('is-dragging');
    },
    _endMouseDrag: function() {
      this._unbindDragEvent();
      this._$view.removeClass('is-dragging');
    },
    _onBodyMouseMove: function(e) {
      let offset = this._$seekBar.offset();
      let left = e.clientX - offset.left;
      let sec = this._posToTime(left);

      util.dispatchCommand(this._$view[0], 'seek', sec);
      this._seekBarToolTip.update(sec, left);
      this._storyboard.setCurrentTime(sec, true);
    },
    _onBodyMouseUp: function() {
      this._endMouseDrag();
    },
    _onWindowBlur: function() {
      this._endMouseDrag();
    },
    _bindDragEvent: function() {
      $('body')
        .on('mousemove.ZenzaWatchSeekBar', this._onBodyMouseMove.bind(this))
        .on('mouseup.ZenzaWatchSeekBar',   this._onBodyMouseUp.bind(this));

      $(window).on('blur.ZenzaWatchSeekBar', this._onWindowBlur.bind(this));
    },
    _unbindDragEvent: function() {
      $('body')
        .off('mousemove.ZenzaWatchSeekBar')
        .off('mouseup.ZenzaWatchSeekBar');
      $(window).off('blur.ZenzaWatchSeekBar');
    },
    _onTimer: function() {
      this._timerCount++;
      let player = this._player;
      let currentTime = player.getCurrentTime();
      if (this._timerCount % 2 === 0) {
        this.setCurrentTime(currentTime);
      }
      this._storyboard.setCurrentTime(currentTime);
    },
    _onLoadVideoInfo: function(videoInfo) {
      this.setDuration(videoInfo.duration);

      if (!this._isFirstVideoInitialized) {
        this._isFirstVideoInitialized = true;
        const handler = (command, param) => this.emit('command', command, param);

        ZenzaWatch.emitter.emitAsync('videoControBar.addonMenuReady',
          this._$view[0].querySelector('.controlItemContainer.left .scalingUI'), handler
        );
        ZenzaWatch.emitter.emitAsync('seekBar.addonMenuReady',
          this._$view[0].querySelector('.seekBar'), handler
        );
      }

      this._resumePointer.setAttribute('duration', videoInfo.duration);
      this._resumePointer.setAttribute('time', videoInfo.initialPlaybackTime);
    },
    setCurrentTime: function(sec) {
      if (this._currentTime === sec) { return; }
      this._currentTime = sec;

      let currentTimeText = util.secToTime(sec);
      if (this._currentTimeText !== currentTimeText) {
        this._currentTimeText = currentTimeText;
        this._$currentTime[0].value = currentTimeText;
      }
      this._pointer.currentTime = sec;
    },
    setDuration: function(sec) {
      if (sec === this._duration) { return; }
      this._duration = sec;
      this._pointer.duration = sec;
      this._pointer.currentTime = -1;

      if (sec === 0 || isNaN(sec)) {
        this._$duration[0].value = '--:--';
      }
      this._$duration[0].value = util.secToTime(sec);
      this.emit('durationChange');
    },
    setBufferedRange: function(range, currentTime) {
      let bufferRange = this._bufferRange;
      if (!range || !range.length || !this._duration) {
        return;
      }
      for (let i = 0, len = range.length; i < len; i++) {
        try {
          let start = range.start(i);
          let end   = range.end(i);
          let width = end - start;
          if (start <= currentTime && end >= currentTime) {
            if (this._bufferStart !== start ||
                this._bufferEnd   !== end) {
              const perLeft = (this._timeToPer(start) - 1);
              const scaleX = (this._timeToPer(width) + 2) / 100;
              bufferRange.style.transform =
                `translate3d(${perLeft}%, 0, 0) scaleX(${scaleX})`;
              this._bufferStart = start;
              this._bufferEnd   = end;
            }
            break;
          }
        } catch (e) {
        }
      }
    },
    resetBufferedRange: function() {
      this._bufferStart = 0;
      this._bufferEnd = 0;
      this._bufferRange.style.transform = 'scaleX(0)';
    }
  });

  class HeatMapModel extends Emitter {
    constructor(params) {
      super();
      this._resolution = params.resolution || HeatMapModel.RESOLUTION;
      this.reset();
    }
  }
  HeatMapModel.RESOLUTION = 100;
  _.assign(HeatMapModel.prototype, {
    reset: function() {
      this._duration = -1;
      this._chatReady = false;
      this.emit('reset');
    },
    setDuration: function(duration) {
      if (this._duration === duration) { return; }
      this._duration = duration;
      this.update();
    },
    setChatList: function(comment) {
      this._chat = comment;
      this._chatReady = true;
      this.update();
    },
    update: function() {
      if (this._duration < 0 || !this._chatReady) {
        return;
      }
      let map = this._getHeatMap();
      this.emitAsync('update', map);
      ZenzaWatch.emitter.emit('heatMapUpdate', {map, duration: this._duration});
      // 無駄な処理を避けるため同じ動画では2回作らないようにしようかと思ったけど、
      // CoreMのマシンでも数ミリ秒程度なので気にしない事にした。
      // Firefoxはもうちょっとかかるかも
      //this._isUpdated = true;
    },
    _getHeatMap: function() {
      let chatList =
        this._chat.top.concat(this._chat.naka, this._chat.bottom);
      let duration = this._duration;
      if (!duration) { return; }
      let map = new Array(Math.max(Math.min(this._resolution, Math.floor(duration)), 1));
      let i = map.length;
      while(i > 0) map[--i] = 0;

      let ratio = duration > map.length ? (map.length / duration) : 1;

      for (i = chatList.length - 1; i >= 0; i--) {
        let nicoChat = chatList[i];
        let pos = nicoChat.getVpos();
        let mpos = Math.min(Math.floor(pos * ratio / 100), map.length -1);
        map[mpos]++;
      }

      return map;
    }
  });

  class HeatMapView {
    constructor(params) {
      this._model  = params.model;
      this._$container = params.$container;
      this._width  = params.width || 100;
      this._height = params.height || 10;

      this._model.on('update', this._onUpdate.bind(this));
      this._model.on('reset',  this._onReset.bind(this));
    }
  }
  _.assign(HeatMapView.prototype, {
    _canvas:  null,
    _palette: null,
    _width: 100,
    _height: 12,
    _initializePalette: function() {
      this._palette = [];
      for (let c = 0; c < 256; c++) {
        let
          r = Math.floor((c > 127) ? (c / 2 + 128) : 0),
          g = Math.floor((c > 127) ? (255 - (c - 128) * 2) : (c * 2)),
          b = Math.floor((c > 127) ? 0 : (255  - c * 2));
        this._palette.push(`rgb(${r}, ${g}, ${b})`);
      }
    },
    _initializeCanvas: function() {
      this._canvas           = document.createElement('canvas');
      this._canvas.className = 'zenzaHeatMap';
      this._canvas.width     = this._width;
      this._canvas.height    = this._height;

      this._$container.append(this._canvas);

      this._context = this._canvas.getContext('2d');

      this.reset();
    },
    _onUpdate: function(map) {
      this.update(map);
    },
    _onReset: function() {
      this.reset();
    },
    reset: function() {
      if (!this._context) { return; }
      this._context.fillStyle = this._palette[0];
      this._context.beginPath();
      this._context.fillRect(0, 0, this._width, this._height);
    },
    update: function(map) {
      if (!this._isInitialized) {
        this._isInitialized = true;
        this._initializePalette();
        this._initializeCanvas();
        this.reset();
      }
      console.time('update HeatMap');

      // 一番コメント密度が高い所を100%として相対的な比率にする
      // 赤い所が常にピークになってわかりやすいが、
      // コメントが一カ所に密集している場合はそれ以外が薄くなってしまうのが欠点
      let max = 0, i;
      // -4 してるのは、末尾にコメントがやたら集中してる事があるのを集計対象外にするため (ニコニ広告に付いてたコメントの名残？)
      for (i = Math.max(map.length - 4, 0); i >= 0; i--) max = Math.max(map[i], max);

      if (max > 0) {
        let rate = 255 / max;
        for (i = map.length - 1; i >= 0; i--) {
          map[i] = Math.min(255, Math.floor(map[i] * rate));
        }
      } else {
        console.timeEnd('update HeatMap');
        return;
      }

      let
        scale = map.length >= this._width ? 1 : (this._width / Math.max(map.length, 1)),
        blockWidth = (this._width / map.length) * scale,
        context = this._context;

      for (i = map.length - 1; i >= 0; i--) {
        context.fillStyle = this._palette[parseInt(map[i], 10)] || this._palette[0];
        context.beginPath();
        context.fillRect(i * scale, 0, blockWidth, this._height);
      }
      console.timeEnd('update HeatMap');
    }
  });

  class HeatMap {
    constructor(params) {
      this._model = new HeatMapModel({});
      this._view = new HeatMapView({
        model: this._model,
        $container: params.$container
      });
      this.reset();
    }
    reset() {
      this._model.reset();
    }
    setDuration(duration) {
      this._model.setDuration(duration);
    }
    setChatList(chatList) {
      this._model.setChatList(chatList);
    }
  }

  class CommentPreviewModel extends Emitter {
    constructor() {
      super();
    }
  }
  _.assign(CommentPreviewModel.prototype, {
    reset: function() {
      this._chatReady = false;
      this._vpos = -1;
      this.emit('reset');
    },
    setChatList: function(chatList) {
      let list = chatList.top.concat(chatList.naka, chatList.bottom);
      list.sort((a, b) => {
        let av = a.getVpos(), bv = b.getVpos();
        return av - bv;
      });

      this._chatList = list;
      this._chatReady = true;
      this.update();
    },
    getChatList: function() {
      return this._chatList || [];
    },
    setCurrentTime: function(sec) {
      this.setVpos(sec * 100);
    },
    setVpos: function(vpos) {
      if (this._vpos !== vpos) {
        this._vpos = vpos;
        this.emit('vpos');
      }
    },
    getCurrentIndex: function() {
      if (this._vpos < 0 || !this._chatReady) {
        return -1;
      }
      return this.getVposIndex(this._vpos);
    },
    getVposIndex: function(vpos) {
      let list = this._chatList;
      for (let i = list.length - 1; i >= 0; i--) {
        let chat = list[i], cv = chat.getVpos();
        if (cv <= vpos - 400) {
          return i + 1;
        }
      }
      return -1;
    },
    getCurrentChatList: function() {
      if (this._vpos < 0 || !this._chatReady) {
        return [];
      }
      return this.getItemByVpos(this._vpos);
    },
    getItemByVpos: function(vpos) {
      let list = this._chatList;
      let result = [];
      for (let i = 0, len = list.length; i < len; i++) {
        let chat = list[i], cv = chat.getVpos(), diff = vpos - cv;
        if (diff >= -100 && diff <= 400) {
          result.push(chat);
        }
      }
      return result;
    },
    getItemByUniqNo: function(uniqNo) {
      return this._chatList.find(chat => chat.getUniqNo() === uniqNo);
    },
    update: function() {
      this.emit('update');
    }
  });

  class CommentPreviewView extends Emitter {
    constructor(...args) {
      super();
      this.initialize(...args);
    }
  }
  CommentPreviewView.MAX_HEIGHT = '200px';
  CommentPreviewView.ITEM_HEIGHT = 20;
  CommentPreviewView.__tpl__ = (`
    <div class="zenzaCommentPreview">
      <div class="zenzaCommentPreviewInner">
      </div>
    </div>
  `).trim();

  CommentPreviewView.__css__ = `
    .zenzaCommentPreview {
      display: none;
      position: absolute;
      bottom: 16px;
      opacity: 0.8;
      max-height: ${CommentPreviewView.MAX_HEIGHT};
      width: 350px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.4);
      color: #ccc;
      z-index: 100;
      overflow: hidden;
      border-bottom: 24px solid transparent;
      transform: translate3d(0, 0, 0);
      transition: transform 0.2s;
    }

    .zenzaCommentPreview.updating {
      transition: opacity 0.2s ease;
      opacity: 0.3;
      cursor: wait;
    }
    .zenzaCommentPreview.updating *{
      pointer-evnets: none;
    }

    body:not(.fullScreen).zenzaScreenMode_sideView .zenzaCommentPreview,
    body:not(.fullScreen).zenzaScreenMode_small .zenzaCommentPreview {
      background: rgba(0, 0, 0, 0.9);
    }

    .seekBarContainer.enableCommentPreview:hover .zenzaCommentPreview.show {
      display: block;
    }
    .zenzaCommentPreview.show:hover {
      background: black;
      overflow: auto;
    }

    .zenzaCommentPreview * {
      box-sizing: border-box;
    }

    .zenzaCommentPreviewInner {
      padding: 4px;
      pointer-events: none;
    }
    .zenzaCommentPreview:hover .zenzaCommentPreviewInner {
      pointer-events: auto;
    }

    .zenzaCommentPreviewInner .nicoChat {
      position: absolute;
      left: 0;
      display: block;
      width: 100%;
      height: ${CommentPreviewView.ITEM_HEIGHT}px;
      padding: 2px 4px;
      cursor: pointer;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .zenzaCommentPreviewInner:hover .nicoChat.odd {
      background: #333;
    }
    .zenzaCommentPreviewInner .nicoChat.fork1 .vposTime{
      color: #6f6;
    }
    .zenzaCommentPreviewInner .nicoChat.fork2 .vposTime{
      color: #66f;
    }



    .zenzaCommentPreviewInner .nicoChat .no,
    .zenzaCommentPreviewInner .nicoChat .date,
    .zenzaCommentPreviewInner .nicoChat .userId {
      display: none;
    }

    .zenzaCommentPreviewInner .nicoChat:hover .no,
    .zenzaCommentPreviewInner .nicoChat:hover .date,
    .zenzaCommentPreviewInner .nicoChat:hover .userId {
      display: inline-block;
      white-space: nowrap;
    }

    .zenzaCommentPreviewInner .nicoChat:hover .text {
      color: #fff !important;
    }
    .zenzaCommentPreviewInner       .nicoChat .text:hover {
      text-decoration: underline;
    }

    .zenzaCommentPreviewInner .nicoChat .addFilter {
      display: none;
      position: absolute;
      font-size: 10px;
      color: #fff;
      background: #666;
      cursor: pointer;
      top: 0;
    }

    .zenzaCommentPreviewInner .nicoChat:hover .addFilter {
      display: inline-block;
      border: 1px solid #ccc;
      box-shadow: 2px 2px 2px #333;
    }

    .zenzaCommentPreviewInner .nicoChat .addFilter.addUserIdFilter {
      right: 8px;
      width: 48px;
    }
    .zenzaCommentPreviewInner .nicoChat .addFilter.addWordFilter {
      right: 64px;
      width: 48px;
    }
    .zenzaCommentPreviewInner .nicoChat .addFilter:active {
      transform: translateY(2px);
    }

  `;

  _.assign(CommentPreviewView.prototype, {
    initialize: function(params) {
      let model = this._model = params.model;
      this._$container = params.$container;

      this._inviewTable = {};
      this._chatList = [];
      this._initializeDom(this._$container);

      model.on('reset',  this._onReset.bind(this));
      model.on('update', _.debounce(this._onUpdate.bind(this), 10));
      model.on('vpos',   _.throttle(this._onVpos  .bind(this), 100));

      this.show = _.throttle(this.show.bind(this), 200);
    },
    _initializeDom: function($container) {
      util.addStyle(CommentPreviewView.__css__);
      let $view = this._$view = $(CommentPreviewView.__tpl__);
      this._$inner = $view.find('.zenzaCommentPreviewInner');

      $view.on('click', this._onClick.bind(this));
      $view[0].addEventListener('wheel', e => e.stopPropagation(), {passive: true});
      $view[0].addEventListener('scroll',
        _.throttle(this._onScroll.bind(this), 50, {trailing: false}), {passive: true});

      $container.on('mouseleave', this.hide.bind(this));
      $container.append($view);
    },
    _onClick: function(e) {
      e.stopPropagation();
      let $view = this._$view;
      let $target = $(e.target);
      let command = $target.attr('data-command');
      let $nicoChat = $target.closest('.nicoChat');
      let uniqNo = parseInt($nicoChat.attr('data-nicochat-uniq-no'), 10);
      let nicoChat  = this._model.getItemByUniqNo(uniqNo);

      if (command && nicoChat && !$view.hasClass('updating')) {
        $view.addClass('updating');

        window.setTimeout(() => { $view.removeClass('updating'); }, 3000);

        switch (command) {
          case 'addUserIdFilter':
            this.emit('command', command, nicoChat.getUserId());
            break;
          case 'addWordFilter':
            this.emit('command', command, nicoChat.getText());
            break;
          case 'addCommandFilter':
            this.emit('command', command, nicoChat.getCmd());
            break;
        }
        return;
      }
      let vpos = $nicoChat.attr('data-vpos');
      if (vpos !== undefined) {
        this.emit('command', 'seek', vpos / 100);
      }
    },
    _onUpdate: function() {
      if (this._isShowing) {
        this._updateView();
      } else {
        this._updated = true;
      }
    },
    _onVpos: function() {
      let index = Math.max(0, this._model.getCurrentIndex());
      let itemHeight = CommentPreviewView.ITEM_HEIGHT;
      this._scrollTop = itemHeight * index;
      this._refreshInviewElements(this._scrollTop);
    },
    _onResize: function() {
      this._refreshInviewElements();
    },
    _onScroll: function() {
      this._scrollTop = -1;
      this._refreshInviewElements();
    },
    _onReset: function() {
      this._$inner.html('');
      this._inviewTable = {};
      this._scrollTop = 0;
      this._$newItems = null;
      this._chatList = [];
    },
    _updateView: function() {
      let chatList = this._chatList = this._model.getChatList();
      if (chatList.length < 1) {
        this.hide();
        this._updated = false;
        return;
      }

      window.console.time('updateCommentPreviewView');
      let itemHeight = CommentPreviewView.ITEM_HEIGHT;

      this._$inner.css({
        height:
        (chatList.length + 2) * itemHeight
      });
      this._updated = false;
      window.console.timeEnd('updateCommentPreviewView');
    },
    _createDom: function(chat, idx) {
      let itemHeight = CommentPreviewView.ITEM_HEIGHT;
      let text = util.escapeHtml(chat.getText());
      let date = (new Date(chat.getDate() * 1000)).toLocaleString();
      let vpos = chat.getVpos();
      let no = chat.getNo();
      let uniqNo = chat.getUniqNo();
      let oe = idx % 2 === 0 ? 'even' : 'odd';
      let title = `${no} : 投稿日 ${date}\nID:${chat.getUserId()}\n${text}\n`;
      let color = chat.getColor() || '#fff';
      let shadow = color === '#fff' ? '' : `text-shadow: 0 0 1px ${color};`;

      let vposToTime = vpos => util.secToTime(Math.floor(vpos / 100));

      return `<li class="nicoChat fork${chat.getFork()} ${oe}"
            id="commentPreviewItem${idx}"
            data-vpos="${vpos}"
            data-nicochat-uniq-no="${uniqNo}"
            style="top: ${idx * itemHeight}px;"
            >
            <span class="vposTime">${vposToTime(vpos)}: </span>
            <span class="text" title="${title}" style="${shadow}">
            ${text}
            </span>
            <span class="addFilter addUserIdFilter"
              data-command="addUserIdFilter" title="NGユーザー">NGuser</span>
            <span class="addFilter addWordFilter"
              data-command="addWordFilter" title="NGワード">NGword</span>
        </li>`;
    },
    _refreshInviewElements: function(scrollTop, startIndex, endIndex) {
      if (!this._$inner) { return; }
      let itemHeight = CommentPreviewView.ITEM_HEIGHT;

      let $view = this._$view;
      scrollTop = _.isNumber(scrollTop) ? scrollTop : $view.scrollTop();

      let viewHeight = $view.innerHeight();
      let viewBottom = scrollTop + viewHeight;
      let chatList = this._chatList;
      if (!chatList || chatList.length < 1) { return; }
      startIndex =
        _.isNumber(startIndex) ? startIndex : Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
      endIndex   =
        _.isNumber(endIndex) ? endIndex : Math.min(chatList.length, Math.floor(viewBottom / itemHeight) + 5);
      let i;

      let newItems = [], inviewTable = this._inviewTable;
      let create = this._createDom;
      for (i = startIndex; i < endIndex; i++) {
        let chat = chatList[i];
        if (inviewTable[i] || !chat) { continue; }
        newItems.push(create(chat, i));
        inviewTable[i] = true;
      }

      if (newItems.length < 1) { return; }

      Object.keys(inviewTable).forEach(i => {
        if (i >= startIndex && i <= endIndex) { return; }
        let item = document.getElementById('commentPreviewItem' + i);
        if (item) { item.remove(); }
        else { window.console.log('not found ', 'commentPreviewItem' + i);}
        delete inviewTable[i];
      });


      let $newItems = $(newItems.join(''));
      if (this._$newItems) {
        this._$newItems.append($newItems);
      } else {
        this._$newItems = $newItems;
      }

      this._applyView();
    },
    _isEmpty: function() {
      return this._chatList.length < 1;
    },
    show: function(left) {
      this._isShowing = true;
      if (this._updated) {
        this._updateView();
      }
      if (this._isEmpty()) {
        return;
      }
      let $view = this._$view, width = $view.outerWidth();
      let containerWidth = this._$container.innerWidth();

      left = Math.min(Math.max(0, left - width / 2), containerWidth - width);
      this._left = left;
      this._applyView();
    },
    _applyView: function() {
      let $view = this._$view;
      if (!$view.hasClass('show')) { $view.addClass('show'); }
      if (this._$newItems) {
        this._$inner.append(this._$newItems);
        this._$newItems = null;
      }
      if (this._scrollTop > 0) {
        $view.scrollTop(this._scrollTop);
        this._scrollTop = -1;
      }

      $view.css('transform', `translate3d(${this._left}px, 0, 0)`);
    },
    hide: function() {
      this._isShowing = false;
      this._$view.removeClass('show');
    }
  });

  class CommentPreview extends Emitter {
    constructor(params) {
      super();
      this._model = new CommentPreviewModel({});
      this._view = new CommentPreviewView({
        model:      this._model,
        $container: params.$container
      });

      this.reset();
    }
    reset() {
      this._left = 0;
      this._model.reset();
      this._view.hide();
    }
    setChatList(chatList) {
      this._model.setChatList(chatList);
    }
    setCurrentTime(sec) {
      this._model.setCurrentTime(sec);
    }
    show(left) {
      this._left = left;
      this._isShow = true;
      if (this._isEnable) {
        this._view.show(left);
      }
    }
    hide() {
      this._isShow = false;
      this._view.hide();
    }
    setIsEnable(v) {
      if (v === this._isEnable) { return; }
      this._isEnable = v;
      if (v && this._isShow) {
        this.show(this._left);
      }
    }
  }

  class SeekBarToolTip {
    constructor(params) {
      this._$container = params.$container;
      this._storyboard = params.storyboard;
      this._initializeDom(params.$container);

      this._boundOnRepeat = this._onRepeat.bind(this);
      this._boundOnMouseUp = this._onMouseUp.bind(this);
    }
  }

  SeekBarToolTip.__css__ = (`
    .seekBarToolTip {
      position: absolute;
      display: none;
      z-index: 300;
      position: absolute;
      box-sizing: border-box;
      bottom: 16px;
      left: 0;
      width: 180px;
      white-space: nowrap;
      font-size: 10px;
      background: rgba(0, 0, 0, 0.3);
      z-index: 150;
      opacity: 0;
      border: 1px solid #666;
      border-radius: 8px;
      padding: 4px 4px 10px 4px;
      transform: translate3d(0, 0, 10px);
      transition: transform 0.1s steps(1, start) 0, opacity 0.2s ease 0.5s;
      pointer-events: none;
    }

    .fullScreen .seekBarToolTip {
      bottom: 10px;
    }

    .is-dragging                .seekBarToolTip {
      opacity: 1;
      pointer-events: none;
    }

    .seekBarContainer:hover  .seekBarToolTip {
      opacity: 1;
      display: inline-block;
      pointer-events: auto;
    }

    .fullScreen .seekBarContainer:not(:hover) .seekBarToolTip {
      display: none;
    }

    .seekBarToolTip .seekBarToolTipInner {
      font-size: 0 !important;
    }

    .seekBarToolTip .seekBarToolTipButtonContainer {
      text-align: center;
      width: 100%;
    }

    .seekBarToolTip .seekBarToolTipButtonContainer>* {
      flex: 1;
    }

    .seekBarToolTip .currentTime {
      display: inline-block;
      height: 16px;
      margin: 4px 0;
      padding: 0 8px;
      color: #ccc;
      text-align: center;
      font-size: 12px;
      line-height: 16px;
      text-shadow: 0 0 2px #000;
    }

    .seekBarToolTip .controlButton {
      display: inline-block;
      width: 40px;
      height: 28px;
      line-height: 22px;
      font-size: 20px;
      border-radius: 50%;
      margin: 0;
      cursor: pointer;
    }
    .seekBarToolTip .controlButton * {
      cursor: pointer;
    }

    .seekBarToolTip .controlButton:hover {
      text-shadow: 0 0 8px #fe9;
      box-shdow: 0 0 8px #fe9;
    }

    .seekBarToolTip .controlButton:active {
      font-size: 16px;
    }

    .seekBarToolTip .controlButton.enableCommentPreview {
      opacity: 0.5;
    }

    .enableCommentPreview .seekBarToolTip .controlButton.enableCommentPreview {
      opacity: 1;
      background: rgba(0,0,0,0.01);
    }

    .seekBarToolTip .seekBarThumbnailContainer {
      pointer-events: none;
      position: absolute;
      top: 0; left: 50%;
      transform: translate(-50%, -100%);
    }
    .seekBarContainer:not(.enableCommentPreview) .seekBarToolTip.storyboard {
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
  `).trim();

  SeekBarToolTip.__tpl__ = (`
    <div class="seekBarToolTip">
      <div class="seekBarThumbnailContainer"></div>
      <div class="seekBarToolTipInner">
        <div class="seekBarToolTipButtonContainer">
          <div class="controlButton backwardSeek" data-command="seekBy" data-param="-5" title="5秒戻る" data-repeat="on">
            <div class="controlButtonInner">⇦</div>
          </div>

          <div class="currentTime"></div>
          
          <div class="controlButton enableCommentPreview" data-command="toggleConfig" data-param="enableCommentPreview" title="コメントのプレビュー表示">
            <div class="menuButtonInner">💬</div>
          </div>
          

          <div class="controlButton forwardSeek" data-command="seekBy" data-param="5" title="5秒進む" data-repeat="on">
            <div class="controlButtonInner">⇨</div>
          </div>
        </div>
      </div>
    </div>
  `).trim();

  _.assign(SeekBarToolTip .prototype, {
    _initializeDom: function($container) {
      util.addStyle(SeekBarToolTip.__css__);
      let $view = this._$view = $(SeekBarToolTip.__tpl__);

      this._currentTime = $view.find('.currentTime')[0];

      $view
        .on('mousedown',this._onMouseDown.bind(this))
        .on('click', e => { e.stopPropagation(); e.preventDefault(); });

      this._seekBarThumbnail = this._storyboard.getSeekBarThumbnail({
        $container: $view.find('.seekBarThumbnailContainer')
      });
      this._seekBarThumbnail.on('visible', v => $view.toggleClass('storyboard', v));

      $container.append($view);
    },
    _onMouseDown: function(e) {
      e.stopPropagation();
      let target = e.target.closest('[data-command]');
      if (!target) {
        return;
      }
      let command = target.dataset.command;
      if (!command) { return; }

      let param   = target.dataset.param;
      let repeat  = target.dataset.repeat === 'on';

      util.dispatchCommand(e.target, command, param);
      if (repeat) {
        this._beginRepeat(command, param);
      }
    },
    _onMouseUp: function(e) {
      e.preventDefault();
      this._endRepeat();
    },
    _beginRepeat(command, param) {
      this._repeatCommand = command;
      this._repeatParam   = param;

      $('body').on('mouseup.zenzaSeekbarToolTip', this._boundOnMouseUp);
      this._$view.on('mouseleave mouseup', this._boundOnMouseUp);
      if (this._repeatTimer) {
        window.clearInterval(this._repeatTimer);
      }
      this._repeatTimer = window.setInterval(this._boundOnRepeat, 200);
      this._isRepeating = true;
    },
    _endRepeat: function() {
      this._isRepeating = false;
      if (this._repeatTimer) {
        window.clearInterval(this._repeatTimer);
        this._repeatTimer = null;
      }
      $('body').off('mouseup.zenzaSeekbarToolTip');
      this._$view.off('mouseleave mouseup');
    },
    _onRepeat: function() {
      if (!this._isRepeating) {
        this._endRepeat();
        return;
      }
      util.dispatchCommand(this._$view[0], this._repeatCommand, this._repeatParam);
    },
    update: function(sec, left) {
      let timeText = util.secToTime(sec);
      if (this._timeText === timeText) { return; }
      this._timeText = timeText;
      this._currentTime.textContent = timeText;
      let w  = this._$view.outerWidth();
      let vw = this._$container.innerWidth();
      left = Math.max(0, Math.min(left - w / 2, vw - w));
      this._$view.css('transform', `translate3d(${left}px, 0, 10px)`);
      this._seekBarThumbnail.setCurrentTime(sec);
    }
  });

  class SmoothSeekBarPointer {
    constructor(params) {
      this._pointer = params.pointer;
      this._currentTime = 0;
      this._duration = 1;
      this._playbackRate = 1;
      this._isSmoothMode = true;
      this._isPausing = false;
      this._isSeeking = false;
      this._isStalled = false;
      if (!this._pointer.animate) {
        this._isSmoothMode = false;
      }
      this._pointer.classList.toggle('is-notSmooth', !this._isSmoothMode);
      params.playerState.on('update-isPausing', v => this.isPausing = v);
      params.playerState.on('update-isSeeking', v => this.isSeeking = v);
      params.playerState.on('update-isStalled', v => this.isStalled = v);
     }
    get currentTime() {
      return this._currentTime;
    }
    set currentTime(v) {
      if (!this._isSmoothMode) {
        const per = Math.min(100, this._timeToPer(v));
        this._pointer.style.transform = `translate3d(${per}vw, 0, 0) translate3d(-50%, -50%, 0)`;
      }
      if (document.hidden) { return; }
      this._currentTime = v;

      // 誤差が一定以上になったときのみ補正する
      // videoのcurrentTimeは秒. Animation APIのcurrentTimeはミリ秒
      if (this._animation &&
        Math.abs(v * 1000 - this._animation.currentTime) > 500) {
        this._animation.currentTime = v * 1000;
        // window.console.info('refreshed!', v*1000, this._animation.currentTime);
      }
    }
    _timeToPer(time) {
      return (time / Math.max(this._duration, 1)) * 100;
    }
    set duration(v) {
      if (this._duration === v) { return; }
      this._duration = v;
      this.refresh();
    }
    set playbackRate(v) {
      if (this._playbackRate === v) { return; }
      this._playbackRate = v;
      if (!this._animation) { return; }
      this._animation.playbackRate = v;
    }
    get isPausing() {
      return this._isPausing;
    }
    set isPausing(v) {
      if (this._isPausing === v) { return; }
      this._isPausing = v;
      this._updatePlaying();
    }
    get isSeeking() {
      return this._isSeeking;
    }
    set isSeeking(v) {
      if (this._isSeeking === v) { return; }
      this._isSeeking = v;
      this._updatePlaying();
    }
    get isStalled() {
      return this._isStalled;
    }
    set isStalled(v) {
      if (this._isStalled === v) { return; }
      this._isStalled = v;
      this._updatePlaying();
    }
    get isPlaying() {
      return !this.isPausing && !this.isStalled && !this.isSeeking;
    }
    _updatePlaying() {
      if (!this._animation) { return; }
      if (this.isPlaying) {
        this._animation.play();
      } else {
        this._animation.pause();
      }
    }
    refresh() {
      if (!this._isSmoothMode) { return; }
      if (this._animation) {
        this._animation.finish();
      }
      this._animation = this._pointer.animate([
        {transform: 'translate3d(-6px, -50%, 0) translate3d(0, 0, 0)'},
        {transform: 'translate3d(-6px, -50%, 0) translate3d(100vw, 0, 0)'}
      ], {
        duration: this._duration * 1000
      });
      this._animation.currentTime = this._currentTime * 1000;
      this._animation.playbackRate = this._playbackRate;
      if (!this._isPausing) {
        this._animation.play();
      }
    }
  }

//===END===

export {
  VideoControlBar,
  HeatMapModel,
  HeatMapView,
  HeatMap,
  CommentPreviewModel,
  CommentPreviewView,
  CommentPreview,
  SeekBarToolTip
};

