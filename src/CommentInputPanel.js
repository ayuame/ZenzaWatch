import * as _ from 'lodash';
import {CONSTANT} from './constant';
import {Emitter} from './baselib';
import {util} from './util';

//===BEGIN===
class CommentInputPanel extends Emitter {
  constructor(params) {
    super();

    this._$playerContainer = params.$playerContainer;
    this._playerConfig = params.playerConfig;

    this._initializeDom();

    this._playerConfig.on('update-autoPauseCommentInput', this._onAutoPauseCommentInputChange.bind(this));
  }
}
CommentInputPanel.__css__ = (`
    .commentInputPanel {
      position: fixed;
      top:  calc(-50vh + 50% + 100vh);
      left: 50vw;
      box-sizing: border-box;

      width: 200px;
      height: 50px;
      z-index: ${CONSTANT.BASE_Z_INDEX + 30000};
      transform: translate(-50%, -170px);
      overflow: visible;
    }
    .zenzaPlayerContainer.is-notPlayed .commentInputPanel,
    .zenzaPlayerContainer.is-waybackMode .commentInputPanel,
    .zenzaPlayerContainer.is-mymemory .commentInputPanel,
    .zenzaPlayerContainer.is-loading  .commentInputPanel,
    .zenzaPlayerContainer.is-error    .commentInputPanel {
      display: none;
    }

    .commentInputPanel:focus-within {
      width: 500px;
      z-index: ${CONSTANT.BASE_Z_INDEX + 100000};
    }
    .zenzaScreenMode_wide .commentInputPanel,
    .is-fullscreen           .commentInputPanel {
      position: absolute !important; /* fixedだとFirefoxのバグで消える */
      top:  auto !important;
      bottom: 120px !important;
      transform: translate(-50%, 0);
      left: 50%;
    }

    /* 縦長モニター */
  /*
    @media
      screen and
      (max-width: 991px) and (min-height: 700px)
    {
      .zenzaScreenMode_normal .commentInputPanel {
        transform: translate(-50%, -230px);
      }
    }
    @media
      screen and
      (max-width: 1215px) and (min-height: 700px)
    {
      .zenzaScreenMode_big .commentInputPanel {
        transform: translate(-50%, -230px);
      }
    }
    */

    .commentInputPanel>* {
      pointer-events: none;
    }
    
    .commentInputPanel input {
      font-size: 18px;
    }

    .commentInputPanel:focus-within>*,
    .commentInputPanel:hover>* {
      pointer-events: auto;
    }

    .is-mouseMoving .commentInputOuter {
      border: 1px solid #888;
      box-sizing: border-box;
      border-radius: 8px;
      opacity: 0.5;
    }
    .is-mouseMoving:not(:focus-within) .commentInputOuter {
      box-shadow: 0 0 8px #fe9, 0 0 4px #fe9 inset;
    }

    .commentInputPanel:focus-within .commentInputOuter,
    .commentInputPanel:hover  .commentInputOuter {
      border: none;
      opacity: 1;
    }

    .commentInput {
      width: 100%;
      height: 30px !important;
      font-size: 24px;
      background: transparent;
      border: none;
      opacity: 0;
      transition: opacity 0.3s ease, box-shadow 0.4s ease;
      text-align: center;
      line-height: 26px !important;
      padding-right: 32px !important;
      margin-bottom: 0 !important;
    }

    .commentInputPanel:hover  .commentInput {
      opacity: 0.5;
    }
    .commentInputPanel:focus-within .commentInput {
      opacity: 0.9 !important;
    }
    .commentInputPanel:focus-within .commentInput,
    .commentInputPanel:hover  .commentInput {
      box-sizing: border-box;
      border: 1px solid #888;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 0 8px #fff;
    }

    .commentInputPanel .autoPauseLabel {
      display: none;
    }

    .commentInputPanel:focus-within .autoPauseLabel {
      position: absolute;
      top: 36px;
      left: 50%;
      transform: translate(-50%, 0);
      display: block;
      background: #336;
      z-index: 100;
      color: #ccc;
      padding: 0 8px;
    }

    .commandInput {
      position: absolute;
      width: 100px;
      height: 30px !important;
      font-size: 24px;
      top: 0;
      left: 0;
      border-radius: 8px;
      z-index: -1;
      opacity: 0;
      transition: left 0.2s ease, opacity 0.2s ease;
      text-align: center;
      line-height: 26px !important;
      padding: 0 !important;
      margin-bottom: 0 !important;
    }
    .commentInputPanel:focus-within .commandInput {
      left: -108px;
      z-index: 1;
      opacity: 0.9;
      border: none;
      pointer-evnets: auto;
      box-shadow: 0 0 8px #fff;
      padding: 0;
    }

    .commentSubmit {
      position: absolute;
      width: 100px !important;
      height: 30px !important;
      font-size: 24px;
      top: 0;
      right: 0;
      border: none;
      border-radius: 8px;
      z-index: -1;
      opacity: 0;
      transition: right 0.2s ease, opacity 0.2s ease;
      line-height: 26px;
      letter-spacing: 0.2em;
    }
    .commentInputPanel:focus-within .commentSubmit {
      right: -108px;
      z-index: 1;
      opacity: 0.9;
      box-shadow: 0 0 8px #fff;
    }
    .commentInputPanel:focus-within .commentSubmit:active {
      color: #000;
      background: #fff;
      box-shadow: 0 0 16px #ccf;
    }
  `).trim();

CommentInputPanel.__tpl__ = (`
    <div class="commentInputPanel forMember" autocomplete="new-password">
      <form action="javascript: void(0);">
      <div class="commentInputOuter">
          <input
            type="text"
            value=""
            autocomplete="on"
            name="mail"
            placeholder="コマンド"
            class="commandInput"
            maxlength="30"
          >
          <input
            type="text"
            value=""
            autocomplete="off"
            name="chat"
            accesskey="c"
            placeholder="コメント入力(C)"
            class="commentInput"
            maxlength="75"
            >
          <input
            type="submit"
            value="送信"
            name="post"
            class="commentSubmit"
            >
          <div class="recButton" title="音声入力">
          </div>
      </div>
      </form>
      <label class="autoPauseLabel">
        <input type="checkbox" class="autoPause" checked="checked">
        入力時に一時停止
      </label>
    </div>
  `).trim();

_.assign(CommentInputPanel.prototype, {
  _initializeDom: function () {
    let $container = this._$playerContainer;
    let config = this._playerConfig;

    util.addStyle(CommentInputPanel.__css__);
    $container.append(CommentInputPanel.__tpl__);

    let $view = this._$view = $container.find('.commentInputPanel');
    let $input = this._$input = $view.find('.commandInput, .commentInput');
    this._$form = $container.find('form');
    let $autoPause = this._$autoPause = $container.find('.autoPause');
    this._$commandInput = $container.find('.commandInput');
    let $cmt = this._$commentInput = $container.find('.commentInput');
    this._$commentSubmit = $container.find('.commentSubmit');
    let preventEsc = e => {
      if (e.keyCode === 27) { // ESC
        e.preventDefault();
        e.stopPropagation();
        this.emit('esc');
        $input.blur();
      }
    };

    $input
      .on('focus', this._onFocus.bind(this))
      .on('blur', _.debounce(this._onBlur.bind(this), 500))
      .on('keydown', preventEsc)
      .on('keyup', preventEsc);

    $autoPause.prop('checked', config.getValue('autoPauseCommentInput'));
    this._$autoPause.on('change', () => {
      config.setValue('autoPauseCommentInput', !!$autoPause.prop('checked'));
      $cmt.focus();
    });
    this._$view.find('label').on('click', e => e.stopPropagation());
    this._$form.on('submit', this._onSubmit.bind(this));
    this._$commentSubmit.on('click', this._onSubmitButtonClick.bind(this));
    $view.on('click', e => e.stopPropagation());
  },
  _onFocus: function () {
    if (!this._hasFocus) {
      this.emit('focus', this.isAutoPause());
    }
    this._hasFocus = true;
  },
  _onBlur: function () {
    if (this._$commandInput.is(':focus') ||
      this._$commentInput.is(':focus')) {
      return;
    }
    this.emit('blur', this.isAutoPause());

    this._hasFocus = false;
  },
  _onSubmit: function () {
    this.submit();
  },
  _onSubmitButtonClick: function () {
    this._$form.submit();
  },
  _onAutoPauseCommentInputChange: function (val) {
    this._$autoPause.prop('checked', !!val);
  },
  submit: function () {
    let chat = this._$commentInput.val().trim();
    let cmd = this._$commandInput.val().trim();
    if (!chat.length) {
      return;
    }

    setTimeout(() => {
      this._$commentInput.val('').blur();
      this._$commandInput.blur();

      let $view = this._$view.addClass('updating');
      (new Promise((resolve, reject) => this.emit('post', {resolve, reject}, chat, cmd)))
        .then(() => $view.removeClass('updating'))
        .catch(() => $view.removeClass('updating'));
    }, 0);
  },
  isAutoPause: function () {
    return !!this._$autoPause.prop('checked');
  },
  focus: function () {
    this._$commentInput.focus();
    this._onFocus();
  },
  blur: function () {
    this._$commandInput.blur();
    this._$commentInput.blur();
    this._onBlur();
  }
});

//===END===
//

export {
  CommentInputPanel
};
