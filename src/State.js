import {Emitter} from './baselib';
import {global} from './ZenzaWatchIndex';
import {CONSTANT} from './constant';
import {bounce} from '../packages/lib/src/infra/bounce';
import {nicoUtil} from '../packages/lib/src/nico/nicoUtil';
//===BEGIN===

class BaseState extends Emitter {
  constructor() {
    super();

    this._name = '';
    this._state = {};
    this._props = {};
    this._changed = new Map;
    this._boundOnChange = bounce.time(this._onChange.bind(this));
  }

  _defineProperty() {
    Object.keys(this._state).forEach(key => {
      Object.defineProperty(
        this,
        key, {
          get: () => this._state[key],
          set: v => this._setState(key, v)
        });
    });
  }

  onkey(key, func) {return this.on(`update-${key}`, func);}
  offkey(key, func) {return this.off(`update-${key}`, func);}

  _onChange() {
    const changed = this._changed;
    this.emit('change', changed, changed.size);
    if (!changed.size) {
      return;
    }
    for (const [key, val] of changed) {
      this.emit('update', key, val);
      this.emit(`update-${key}`, val);
    }
    this._changed.clear();
  }

  setState(key, val) {
    if (typeof key === 'string') {
      return this._setState(key, val);
    }
    for (const k of (key instanceof Map ? key : Object.keys(key))) {
      this._setState(k, key[k]);
    }
  }

  _setState(key, val) {
    if (!this._state.hasOwnProperty(key)) {
      window.console.warn('%cUnknown property %s = %s', 'background: yellow;', key, val);
      console.trace();
    }
    if (this._state[key] === val) {
      return;
    }
    this._state[key] = val;
    this._changed.set(key, val);
    this._boundOnChange();
  }
}

class PlayerState extends BaseState {
  static getInstance(config) {
    if (!PlayerState.instance) {
      PlayerState.instance = new PlayerState(config);
    }
    return PlayerState.instance;
  }
  constructor(config) {
    super();
    this._name = 'Player';
    this._state = {
      isAbort: false,
      isBackComment: config.props.backComment,
      isChanging: false,
      isChannel: false,
      isShowComment: config.props.showComment,
      isCommentReady: false,
      isCommentPosting: false,
      isCommunity: false,
      isWaybackMode: false,
      isDebug: config.props.debug,
      isDmcAvailable: false,
      isDmcPlaying: false,
      isError: false,
      isLoading: false,
      isLoop: config.props.loop,
      isMute: config.props.mute,
      isMymemory: false,
      isOpen: false,
      isPausing: true,
      isPlaylistEnable: false,
      isPlaying: false,
      isSeeking: false,
      isRegularUser: !nicoUtil.isPremium(),
      isStalled: false,
      isUpdatingDeflist: false,
      isUpdatingMylist: false,
      isNotPlayed: true,
      isYouTube: false,

      isEnableFilter: config.props.enableFilter,
      sharedNgLevel: config.props.sharedNgLevel,

      currentSrc: '',
      currentTab: config.props.videoInfoPanelTab,
      // aspectRatio: 9/16,

      errorMessage: '',
      screenMode: config.props.screenMode,
      playbackRate: config.props.playbackRate,
      thumbnail: '',
      videoCount: {},
      videoSession: {}
    };

    this._defineProperty();
  }

  set videoInfo(videoInfo) {
    if (this._videoInfo) {
      this._videoInfo.update(videoInfo);
    } else {
      this._videoInfo = videoInfo;
    }
    global.debug.videoInfo = videoInfo;
    this.videoCount = videoInfo.count;
    this.thumbnail = videoInfo.betterThumbnail;
    this.emit('update-videoInfo', videoInfo);
  }

  get videoInfo() {
    return this._videoInfo;
  }

  set chatList(chatList) {
    this._chatList = chatList;
    this.emit('update-chatList', this._chatList);
  }

  get chatList() {
    return this._chatList;
  }

  resetVideoLoadingStatus() {
    this.setState({
      isLoading: true,
      isPlaying: false,
      isPausing: true,
      isSeeking: false,
      isStalled: false,
      isError: false,
      isAbort: false,
      isMymemory: false,
      isCommunity: false,
      isChannel: false,
      currentSrc: CONSTANT.BLANK_VIDEO_URL
    });
  }

  setVideoCanPlay() {
    this.setState({
      isStalled: false, isLoading: false, isPausing: true, isNotPlayed: true, isError: false, isSeeking: false
    });
  }

  setPlaying() {
    this.setState({
      isPlaying: true,
      isPausing: false,
      isLoading: false,
      isNotPlayed: false,
      isError: false,
      isStalled: false
    });
  }

  setPausing() {
    this.setState({isPlaying: false, isPausing: true});
  }

  setVideoEnded() {
    this.setState({isPlaying: false, isPausing: true, isSeeking: false});
  }

  setVideoErrorOccurred() {
    this.setState({isError: true, isPlaying: false, isPausing: true, isLoading: false, isSeeking: false});
  }
}

//===END===

export {
  BaseState,
  PlayerState
};