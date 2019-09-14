import {ZenzaWatch} from '../../../../src/ZenzaWatchIndex';
import {util} from '../../../../src/util';

/**

 参考: http://www37.atwiki.jp/commentart/pages/44.html
 https://www.w3.org/TR/css3-fonts/#font-kerning-prop

 MINCHO

 \u02C9\u2105\u2109\u2196-\u2199\u220F\u2215\u2248\u2264\u2265\u2299\u2474-\u2482\u250D\u250E\u2511\u2512\u2515\u2516\u2519\u251A\u251E\u251F\u2521\u2522\u2526\u2527\u2529\u252A\u252D\u252E\u2531\u2532\u2535\u2536\u2539\u253A\u253D\u253E\u2540\u2541\u2543-\u254A\u2550-\u256C\u2584\u2588\u258C\u2593

 GULIM
 \u0126\u0127\u0132\u0133\u0138\u013F\u0140\u0149-\u014B\u0166\u0167\u02D0\u02DA\u2074\u207F\u2081-\u2084\u2113\u2153\u2154\u215C-\u215E\u2194-\u2195\u223C\u249C-\u24B5\u24D0-\u24E9\u2592\u25A3-\u25A9\u25B6\u25B7\u25C0\u25C1\u25C8\u25D0\u25D1\u260E\u260F\u261C\u261E\u2660\u2661\u2663-\u2665\u2667-\u2669\u266C\u3131-\u318E\u3200-\u321C\u3260-\u327B\u3380-\u3384\u3388-\u338D\u3390-\u339B\u339F\u33A0\u33A2-\u33CA\u33CF\u33D0\u33D3\u33D6\u33D8\u33DB-\u33DD\uF900-\uF928\uF92A-\uF994\uF996-\uFA0B\uFFE6

 STRONG MINCHO
 \u01CE\u0D00\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u0251\u0261\u02CA\u02CB\u2016\u2035\u216A\u216B\u2223\u2236\u2237\u224C\u226E\u226F\u2295\u2483-\u249B\u2504-\u250B\u256D-\u2573\u2581-\u2583\u2585-\u2586\u2589-\u258B\u258D-\u258F\u2594\u2595\u25E2-\u25E5\u2609\u3016\u3017\u301E\u3021-\u3029\u3105-\u3129\u3220-\u3229\u32A3\u33CE\u33D1\u33D2\u33D5\uE758-\uE864\uFA0C\uFA0D\uFE30\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B\uFA0C\uFA0D\uFE30\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B


 MINCHO: /([ˊˋ⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛▁▂▃▄▅▆▇█▉▊▋▌▍▎▏◢◣◤◥〡〢〣〤〥〦〧〨〩ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ︰︱︳︴︵︶︷︸︹︺︻︼︽︾︿﹀﹁﹂﹃﹄﹉﹊﹋﹌﹍﹎﹏﹐﹑﹒﹔﹕﹖﹗﹙﹚﹛﹜﹝﹞﹟﹠﹡﹢﹣﹤﹥﹦﹨﹩﹪﹫▓])/g,
 MINCHO: /([\u02CA-\u02CB\u2474-\u2487\u2488-\u249B\u2581-\u258F\u25E2-\u25E5\u2593-\u2595\u3021-\u3029\u3105-\u3129\uFE30-\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B])/g,
 GULIM: /([㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛㈜㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㉿ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵￦⊙ㅂㅑㅜㆁ▒ㅅㅒㅡㆍㄱㅇㅓㅣㆎㄴㅏㅕㅤ♡ㅁㅐㅗㅿ♥])/g,
 GULIM: /([\u2299\u2592\u3131\u3134\u3141\u3142\u3145\u3147\u314F\u3150\u3151\u3152\u3153\u3155\u3157\u315C\u3161\u3163\u3164\u317F\u3181\u318D\u318E\u2661\u2688\u2665\u3200-\u321C\u3260-\u327B\u24D0-\u24E9\u249C-\u24B5\uFFE6])/g,
 MING_LIU: /([])/g,

 */

/*

  .tab_space { font-family: 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace; opacity: 0; }
  .big    .tab_space { letter-spacing: 1.6241em; }
  .medium .tab_space { letter-spacing: 1.6252em; }
  .small  .tab_space { letter-spacing: 1.5375em; }


  .type0020 { font-family: 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace; }
  .big    .type0020 { letter-spacing: -0.2966em; }
  .medium .type0020 { letter-spacing: -0.2806em; }
  .small  .type0020 { letter-spacing: -0.2667em; }


  .gothic > .type3000 { font-family: 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace; }
  .big    .gothic > .type3000 { letter-spacing: -0.3103em; }
  .medium .gothic > .type3000 { letter-spacing: -0.2943em; }
  .small  .gothic > .type3000 { letter-spacing: -0.2693em; }


  .type00A0 { font-family: 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace; }
  .big    .type00A0 { letter-spacing: -0.2966em; }
  .medium .type00A0 { letter-spacing: -0.2806em; }
  .small  .type00A0 { letter-spacing: -0.2667em; }



*/
/*
  {*
    空白文字の幅をWindowsと同等にしたい。調査中
    等幅フォントを縮めることで環境差異のない幅を確保するという狙いだが・・・。

    やりすぎるとMac版Chromeでバグって逆に幅が狂う模様。
  *}
  {*
  .tab_space { font-family: 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace; opacity: 0; }
  .big    .tab_space { letter-spacing: 1.6241em; font-size: 39px;}
  .medium .tab_space { letter-spacing: 1.6252em; font-size: 24px;}
  .small  .tab_space { letter-spacing: 1.5375em; font-size: 15px;}

  .gothic > .type3000 {
    font-family: Osaka-mono, 'ＭＳ ゴシック', monospace;
    letter-spacing: -0.2943em;
  }

  .type0020 {
    font-family: Osaka-mono, 'ＭＳ ゴシック', monospace;
    letter-spacing: -0.1805em;
  }

  .type00A0 {
    font-family: Osaka-mono, 'ＭＳ ゴシック', monospace;
    letter-spacing: -0.1805em;
  }
  *}
{*
  .type0020 { font-family: 'Osaka-mono', 'ＭＳ ゴシック', monospace; }
  .big    .type0020 { letter-spacing: -0.216em; font-size: 39px; }
  .medium .type0020 { letter-spacing: -0.2001em; font-size: 24px; }
  .small  .type0020 { letter-spacing: -0.1862em; font-size: 15px; }
*}
{*
  .gothic > .type3000 { font-family: 'Osaka-mono', 'ＭＳ ゴシック', monospace; }
  .big    .gothic > .type3000 { letter-spacing: -0.3103em; font-size: 39px; }
  .medium .gothic > .type3000 { letter-spacing: -0.2943em; font-size: 24px; }
  .small  .gothic > .type3000 { letter-spacing: -0.2693em; font-size: 15px; }
*}
{*
  .type00A0 { font-family: 'Osaka-mono', 'ＭＳ ゴシック', monospace; }
  .big    .type00A0 { letter-spacing: -0.216em; font-size: 39px; }
  .medium .type00A0 { letter-spacing: -0.2001em; font-size: 24px; }
  .small  .type00A0 { letter-spacing: -0.1862em; font-size: 15px; }
*}


<div style="
    display: block;
    padding: 0;
    margin: 0;
    width: 684px;
    white-space: nowrap;
    border: 1px solid orange;
    box-sizing: border-box;
    border-width: 0 16px 16px 0
">
  <!--684x50 17-->
  <span class="big" style="display: inline-block;font-size: 39px;line-height: 46px;padding: 2px;margin: 0;font-weight: 600;letter-spacing: 1px;"
  >一二三四五六七八九十一二三四五六七</span><br>
  <!--679x34 25-->
  <span class="medium" style="display: inline-block;font-size: 26px;line-height: 30px;padding: 2px;margin: 0;font-weight: 600;letter-spacing: 1px;"
  >一二三四五六七八九十一二三四五六七八九十一二三四五</span><br>
  <!--670x22 37-->
  <span class="small" style="display: inline-block;font-size: 17px;line-height: 18px;padding: 2px;margin: 0;font-weight: 600;letter-spacing: 1px;"
  >一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七</span>
</div>

<div style="
    display: block;
    padding: 0;
    margin: 0;
    width: 672px;
    white-space: nowrap;
    border: 1px solid orange;
    box-sizing: border-box;
    border-width: 0 16px 16px 0
">
  <span class="big" style="
    display: inline-block;
    font-size: 39px;
    line-height: 46px;
    padding: 2px;margin: 0;font-weight: 600;letter-spacing: 1px;"
  >一二三四五六七八九十一二三四五六七</span><br>
  <span class="medium" style="
    display: inline-block;
    font-size: 26px;
    line-height: 30px;
    padding: 2px;margin: 0;font-weight: 600;letter-spacing: 1px;"
  >一二三四五六七八九十一二三四五六七八九十一二三四五</span><br>
  <span class="small" style="
    display: inline-block;
    font-size: 17px;
    line-height: 18px;
    padding: 2px;
    margin: 0;
    font-weight: 600;
    letter-spacing: 1px;"
  >一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七</span>
</div>

*/
//===BEGIN===
function NicoTextParserInitFunc() {
class NicoTextParser {}
NicoTextParser._FONT_REG = {
  // TODO: wikiにあるテーブルを正規表現に落とし込む
  // MING_LIUは昔どこかで拾ったのだけど出典がわからない
  // wikiの記述だと\u2588はstrongではないっぽいけど、そうじゃないと辻褄が合わないCAがいくつかある。
  // wikiが間違いなのか、まだ知らない法則があるのか・・・？
  //
//    GOTHIC: /[ｧ-ﾝﾞ･ﾟ]/,
  /* eslint-disable */
  GOTHIC: /[\uFF67-\uFF9D\uFF9E\uFF65\uFF9F]/,
  MINCHO: /([\u02C9\u2105\u2109\u2196-\u2199\u220F\u2215\u2248\u2264\u2265\u2299\u2474-\u2482\u250D\u250E\u2511\u2512\u2515\u2516\u2519\u251A\u251E\u251F\u2521\u2522\u2526\u2527\u2529\u252A\u252D\u252E\u2531\u2532\u2535\u2536\u2539\u253A\u253D\u253E\u2540\u2541\u2543-\u254A\u2550-\u256C\u2584\u2588\u258C\u2593\u01CE\u0D00\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u0251\u0261\u02CA\u02CB\u2016\u2035\u216A\u216B\u2223\u2236\u2237\u224C\u226E\u226F\u2295\u2483-\u249B\u2504-\u250B\u256D-\u2573\u2581-\u2583\u2585-\u2586\u2589-\u258B\u258D-\u258F\u2594\u2595\u25E2-\u25E5\u2609\u3016\u3017\u301E\u3021-\u3029\u3105-\u3129\u3220-\u3229\u32A3\u33CE\u33D1\u33D2\u33D5\uE758-\uE864\uFA0C\uFA0D\uFE30\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B])/,
  GULIM: /([\u0126\u0127\u0132\u0133\u0138\u013F\u0140\u0149-\u014B\u0166\u0167\u02D0\u02DA\u2074\u207F\u2081-\u2084\u2113\u2153\u2154\u215C-\u215E\u2194-\u2195\u223C\u249C-\u24B5\u24D0-\u24E9\u2592\u25A3-\u25A9\u25B6\u25B7\u25C0\u25C1\u25C8\u25D0\u25D1\u260E\u260F\u261C\u261E\u2660\u2661\u2663-\u2665\u2667-\u2669\u266C\u3131-\u318E\u3200-\u321C\u3260-\u327B\u3380-\u3384\u3388-\u338D\u3390-\u339B\u339F\u33A0\u33A2-\u33CA\u33CF\u33D0\u33D3\u33D6\u33D8\u33DB-\u33DD\uF900-\uF928\uF92A-\uF994\uF996-\uFA0B\uFFE6])/,
  MING_LIU: /([\uEF00-\uEF1F])/,
  GR: /<group>([^\x01-\x7E^\xA0]*?([\uFF67-\uFF9D\uFF9E\uFF65\uFF9F\u02C9\u2105\u2109\u2196-\u2199\u220F\u2215\u2248\u2264\u2265\u2299\u2474-\u2482\u250D\u250E\u2511\u2512\u2515\u2516\u2519\u251A\u251E\u251F\u2521\u2522\u2526\u2527\u2529\u252A\u252D\u252E\u2531\u2532\u2535\u2536\u2539\u253A\u253D\u253E\u2540\u2541\u2543-\u254A\u2550-\u256C\u2584\u2588\u258C\u2593\u0126\u0127\u0132\u0133\u0138\u013F\u0140\u0149-\u014B\u0166\u0167\u02D0\u02DA\u2074\u207F\u2081-\u2084\u2113\u2153\u2154\u215C-\u215E\u2194-\u2195\u223C\u249C-\u24B5\u24D0-\u24E9\u2592\u25A3-\u25A9\u25B6\u25B7\u25C0\u25C1\u25C8\u25D0\u25D1\u260E\u260F\u261C\u261E\u2660\u2661\u2663-\u2665\u2667-\u2669\u266C\u3131-\u318E\u3200-\u321C\u3260-\u327B\u3380-\u3384\u3388-\u338D\u3390-\u339B\u339F\u33A0\u33A2-\u33CA\u33CF\u33D0\u33D3\u33D6\u33D8\u33DB-\u33DD\uF900-\uF928\uF92A-\uF994\uF996-\uFA0B\uFFE6\uEF00-\uEF1F\u01CE\u0D00\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u0251\u0261\u02CA\u02CB\u2016\u2035\u216A\u216B\u2223\u2236\u2237\u224C\u226E\u226F\u2295\u2483-\u249B\u2504-\u250B\u256D-\u2573\u2581-\u2583\u2585-\u2586\u2589-\u258B\u258D-\u258F\u2594\u2595\u25E2-\u25E5\u2609\u3016\u3017\u301E\u3021-\u3029\u3105-\u3129\u3220-\u3229\u32A3\u33CE\u33D1\u33D2\u33D5\uE758-\uE864\uFA0C\uFA0D\uFE30\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B])[^\x01-\x7E^\xA0]*?)<\/group>/g,
  STRONG_MINCHO: /([\u01CE\u0D00\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u0251\u0261\u02CA\u02CB\u2016\u2035\u216A\u216B\u2223\u2236\u2237\u224C\u226E\u226F\u2295\u2483-\u249B\u2504-\u250B\u256D-\u2573\u2581-\u2583\u2585-\u2586\u2589-\u258B\u258D-\u258F\u2594\u2595\u25E2-\u25E5\u2609\u3016\u3017\u301E\u3021-\u3029\u3105-\u3129\u3220-\u3229\u32A3\u33CE\u33D1\u33D2\u33D5\uE758-\uE864\uFA0C\uFA0D\uFE30\uFE31\uFE33-\uFE44\uFE49-\uFE52\uFE54-\uFE57\uFE59-\uFE66\uFE68-\uFE6B\u2588])/,
  // ドット絵系によく使われる文字. 綺麗に見せるためにエフェクトを変えたい
  BLOCK: /([\u2581-\u258F\u25E2-\u25E5■]+)/g,
  /* eslint-enable */
};


// 画面レイアウトに影響ありそうなCSSをこっちにまとめる
NicoTextParser.__css__ = (`
body {
  marign: 0;
  padding: 0;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}

.default {}
.gothic  {font-family: 'ＭＳ Ｐゴシック', 'IPAMonaPGothic', sans-serif, Arial, 'Menlo'; }
.mincho  {font-family: Simsun,            "Osaka−等幅", 'ＭＳ 明朝', 'ＭＳ ゴシック', 'モトヤLシーダ3等幅', 'Hiragino Mincho ProN'; }
.gulim   {font-family: Gulim,             Osaka-mono, "Osaka−等幅",              'ＭＳ ゴシック', 'モトヤLシーダ3等幅'; }
.mingLiu {font-family: PmingLiu, mingLiu, MingLiU, Osaka-mono, "Osaka−等幅", 'ＭＳ 明朝', 'ＭＳ ゴシック', 'モトヤLシーダ3等幅'; }
han_group { font-family: 'Arial'; }


/* 参考: https://www65.atwiki.jp/commentart2/pages/16.html */
.cmd-gothic {
  font-weight: 400;
  font-family: "游ゴシック", "Yu Gothic", 'YuGothic', Simsun, "ＭＳ ゴシック", "IPAMonaPGothic", sans-serif, Arial, Menlo;}
.cmd-mincho {
  font-weight: 400;
  font-family: "游明朝体", "Yu Mincho", 'YuMincho', Simsun, "Osaka−等幅", "ＭＳ 明朝", "ＭＳ ゴシック", "モトヤLシーダ3等幅", 'Hiragino Mincho ProN', monospace;
}
.cmd-defont {
  font-family: arial, "ＭＳ Ｐゴシック", "MS PGothic", "MSPGothic", "ヒラギノ角ゴ", "ヒラギノ角ゴシック", "Hiragino Sans", "IPAMonaPGothic", sans-serif, monospace, Menlo;
}

.nicoChat {
  position: absolute;

  letter-spacing: 1px;
  padding: 2px 0 2px;
  margin: 0;
  white-space: nowrap;
  /*font-weight: 600;
  -webkit-font-smoothing: none;
  font-smooth: never;*/
  /* text-rendering: optimizeSpeed; */
  /*font-kerning: none;*/
}

  .nicoChat.big {
    line-height: 45px;
  }
    .nicoChat.big.html5 {
      line-height: ${47.5 -1}px;
    }
    .nicoChat.big.is-lineResized {
      line-height: ${48}px;
    }

  .nicoChat.medium {
    line-height: 29px;
  }
    .nicoChat.medium.html5 {
      line-height: ${(384 - 4) / 13}px;
    }
    .nicoChat.medium.is-lineResized {
      line-height: ${(384 - 4) * 2 / 25 -0.4}px;
    }

  .nicoChat.small {
    line-height: 18px;
  }
    .nicoChat.small.html5 {
      line-height: ${(384 - 4) / 21}px;
    }
    .nicoChat.small.is-lineResized {
      line-height: ${(384 - 4) * 2 / 38}px;
    }

  .arial.type2001 {
    font-family: Arial;
  }
  /* フォント変化のあったグループの下にいるということは、
      半角文字に挟まれていないはずである。
    */
    .gothic > .type2001 {
      font-family: 'ＭＳ Ｐゴシック', 'IPAMonaPGothic', sans-serif, Arial, 'Menlo';
    }
    .mincho > .type2001 {
      font-family: Simsun,            Osaka-mono, 'ＭＳ 明朝', 'ＭＳ ゴシック', 'モトヤLシーダ3等幅', monospace
    }
    .gulim > .type2001 {
      font-family: Gulim,             Osaka-mono,              'ＭＳ ゴシック', 'モトヤLシーダ3等幅', monospace;
    }
    .mingLiu > .type2001 {
      font-family: PmingLiu, mingLiu, Osaka-mono, 'ＭＳ 明朝', 'ＭＳ ゴシック', 'モトヤLシーダ3等幅', monospace;
    }

/*
.tab_space { opacity: 0; }
.big    .tab_space > spacer { width:  86.55875px;  }
.medium .tab_space > spacer { width:  53.4px;  }
.small  .tab_space > spacer { width:  32.0625px;  }
*/

.tab_space { font-family: 'Courier New', Osaka-mono, 'ＭＳ ゴシック', monospace; opacity: 0 !important; }
.big    .tab_space { letter-spacing: 1.6241em; }
.medium .tab_space { letter-spacing: 1.6252em; }
.small  .tab_space { letter-spacing: 1.5375em; }


.big    .type0020 > spacer { width: 11.8359375px; }
.medium .type0020 > spacer { width: 7.668px; }
.small  .type0020 > spacer { width: 5px; }
/*
.big    .type3000 > spacer { width: 40px; }
.medium .type3000 > spacer { width: 25px; }
.small  .type3000 > spacer { width: 17px; }
*/
/*
.type3000 > spacer::after { content: ' '; }
.mincho > .type3000 > spacer::after, .gulim > .type3000 > spacer::after, .mincho > .type3000 > spacer::after {
  content: '全';
}
*/

.big    .gothic > .type3000 > spacer { width: 26.8984375px; }
.medium .gothic > .type3000 > spacer { width: 16.9375px; }
.small  .gothic > .type3000 > spacer { width: 10.9609375px; }

.big    .type00A0 > spacer { width: 11.8359375px; }
.medium .type00A0 > spacer { width: 7.668px; }
.small  .type00A0 > spacer { width: 5px; }

spacer { display: inline-block; overflow: hidden; margin: 0; padding: 0; height: 8px; vertical-align: middle;}

.mesh_space {
  display: inline-block; overflow: hidden; margin: 0; padding: 0; letter-spacing: 0;
  vertical-align: middle; font-weight: normal;
  white-space: nowrap;
}
.big    .mesh_space { width: 40px; }
.medium .mesh_space { width: 26px; }
.small  .mesh_space { width: 18px; }

/*
.fill_space {
  display: inline-block; overflow: hidden; margin: 0; padding: 0; letter-spacing: 0;
            vertical-align: bottom; font-weight: normal;
  white-space: nowrap;
}
.big    .fill_space { width: 40px; height: 40px; }
.medium .fill_space { width: 25px; height: 25px; }
.small  .fill_space { width: 16px; height: 16px; }
*/

.backslash {
  font-family: Arial;
}

/* Mac Chrome バグ対策？ 空白文字がなぜか詰まる これでダメならspacer作戦 */
.invisible_code {
  font-family: gulim;
}

.block_space {
  font-family: Simsun, 'IPAMonaGothic', Gulim, PmingLiu;
}

.html5_tab_space, .html5_space, .html5_zen_space { opacity: 0; }

/*
.nicoChat.small .html5_zen_space > spacer { width: 25.6px; }
                .html5_zen_space > spacer { width: 25.6px; margin: 0; }
.nicoChat.big   .html5_zen_space > spacer { width: 25.6px; }
*/
.html5_zero_width { display: none; }

.no-height {
  line-height: 0 !important;
  opacity: 0;
  display: block;
  visibility: hidden;
  }

/* .line53 {
    display: inline-block;
    line-height: 32px;
  }
  .line100 {
    display: inline-block;
    line-height: 23.5px;
  }*/
  /*.line70 {
    display: inline-block;
    line-height: 27px;
  }*/

  `).trim();

/**
 *  たぶんこんな感じ
 *  1. 全角文字(半角スペース含まない)でグループ化
 *  2. グループ内でフォント変化文字が1つある場合はグループ全体がそのフォント
 *  3. 二つ以上ある場合は、一番目がグループ内のベースフォント、
 *     二番目以降はそのフォントにチェンジ
 *  4. 最初のグループにフォントチェンジがあった場合は、
 *     グループ全体のベースフォントがグループ1の奴になる
 *
 *  Vista以降だともうちょっと複雑らしい
 *
 *
 *  もし新規でニコニコ動画のようなシステムを作るのであれば、こんな複雑怪奇な物を実装する必要はない。
 *  ならどうしてやっているのかといえば、過去のコメントアートを再現したいからである。
 */
NicoTextParser.likeXP = text => {
  let S = '<spacer> </spacer>';
  let ZS = '<spacer>全</spacer>';
  let htmlText =
    util.escapeHtml(text)
    // 行末の半角スペース、全角スペース、タブの除去
    //.replace(/([\x20|\u3000|\t])+([\n$])/g , '$2')
    // 半角文字グループ(改行以外)
      .replace(/([\x01-\x09\x0B-\x7E\xA0]+)/g, '<han_group>$1</han_group>') // eslint-disable-line
      // 全角文字の連続をグループ化 要検証: \u2003は含む？
      .replace(/([^\x01-\x7E^\xA0]+)/g, '<group>$1</group>') // eslint-disable-line
      .replace(/([\u0020]+)/g, // '<span class="han_space type0020">$1</span>')
        g => `<span class="han_space type0020">${S.repeat(g.length)}</span>`)
      //'<span class="han_space type0020">$1</span>')
      .replace(/([\u00A0]+)/g, //  '<span class="han_space type00A0">$1</span>')
        g => `<span class="han_space type00A0">${S.repeat(g.length)}</span>`)
      .replace(/(\t+)/g, '<span class="tab_space">$1</span>')
      .replace(/[\t]/g, '^');

  let /* hasFontChanged = false, */ strongFont = 'gothic';
  // フォント変化処理  XPをベースにしたい
  // CA職人のマイメモリーでもない限りフォント変化文字にマッチすること自体がレアなので、
  // 一文字ずつ走査してもさほど問題ないはず
  htmlText =
    htmlText.replace(NicoTextParser._FONT_REG.GR, (all, group, firstChar) => {
      // hasFontChanged = true;
      let baseFont = '';
      if (firstChar.match(NicoTextParser._FONT_REG.GOTHIC)) {
        baseFont = 'gothic';
      } else if (firstChar.match(NicoTextParser._FONT_REG.MINCHO)) {
        baseFont = 'mincho';
        if (firstChar.match(NicoTextParser._FONT_REG.STRONG_MINCHO)) {
          strongFont = 'mincho';
        }
      } else if (firstChar.match(NicoTextParser._FONT_REG.GULIM)) {
        strongFont = baseFont = 'gulim';
      } else {
        strongFont = baseFont = 'mingLiu';
      }

      let tmp = [], closer = [], currentFont = baseFont;
      for (let i = 0, len = group.length; i < len; i++) {
        let c = group.charAt(i);
        if (currentFont !== 'gothic' && c.match(NicoTextParser._FONT_REG.GOTHIC)) {
          tmp.push('<span class="gothic">');
          closer.push('</span>');
          currentFont = 'gothic';
        } else if (currentFont !== 'mincho' && c.match(NicoTextParser._FONT_REG.MINCHO)) {
          tmp.push('<span class="mincho">');
          closer.push('</span>');
          currentFont = 'mincho';
          if (c.match(NicoTextParser._FONT_REG.STRONG_MINCHO)) {
            strongFont = baseFont = 'mincho';
          }
        } else if (currentFont !== 'gulim' && c.match(NicoTextParser._FONT_REG.GULIM)) {
          tmp.push('<span class="gulim">');
          closer.push('</span>');
          currentFont = strongFont = baseFont = 'gulim';
        } else if (currentFont !== 'mingLiu' && c.match(NicoTextParser._FONT_REG.MING_LIU)) {
          tmp.push('<span class="mingLiu">');
          closer.push('</span>');
          currentFont = strongFont = baseFont = 'mingLiu';
        }
        tmp.push(c);
      }

      let result = [
        '<group class="', baseFont, ' fontChanged">',
        tmp.join(''),
        closer.join(''),
        '</group>'
      ].join('');

      return result;
    });

  htmlText =
    htmlText
      .replace(NicoTextParser._FONT_REG.BLOCK, '<span class="block_space">$1</span>')
      .replace(/([\u2588]+)/g, //'<span class="fill_space">$1</span>')
        g => `<span class="fill_space">${'田'.repeat(g.length)}</span>`)
            //+ g + '</span>';
            //'■'._repeat(g.length) + '</span>';
      .replace(/([\u2592])/g, '<span class="mesh_space">$1$1</span>')
      // 非推奨空白文字。 とりあえず化けて出ないように
      .replace(/([\uE800\u2002-\u200A\u007F\u05C1\u0E3A\u3164]+)/g,
        //'<span class="invisible_code">$1</span>')
        g => `<span class="invisible_code" data-code="${escape(g)}">${g}</span>`)
        // function (g) {
        //   let e = window.escape(g);
        //   return '<span class="invisible_code" data-code="' + e + '">' + g + '</span>';
        // })
      // 結合文字 前の文字と同じ幅になるらしい
      // http://www.nicovideo.jp/watch/1376820446 このへんで見かけた
      .replace(/(.)[\u0655]/g, '$1<span class="type0655">$1</span>')
      //http://www.nicovideo.jp/watch/1236260707 で見かける謎スペース。よくわからない
      .replace(/([\u115a]+)/g, '<span class="zen_space type115A">$1</span>')
      // 推奨空白文字
      // なんか前後の文字によって書体(幅)が変わるらしい。 隣接セレクタでどうにかなるか？
      //  .replace(/([\u2001]+)/g ,  '<span class="zen_space type2001">$1</span>')
      // 全角スペース
      .replace(/([\u3000]+)/g, //'<span class="zen_space type3000">$1</span>')
        g => `<span class="zen_space type3000">${ZS.repeat(g.length)}</span>`)
        // function (g) {
        //   return '<span class="zen_space type3000">' + ZS.repeat(g.length) + '</span>';
        // })
      // バックスラッシュ
      .replace(/\\/g, '<span lang="en" class="backslash">&#x5c;</span>')
      // ゼロ幅文字. ゼロ幅だけどdisplay: none; にすると狂う
      .replace(/([\u0323\u2029\u202a\u200b\u200c]+)/g, '<span class="zero_space">$1</span>')
      // &emsp;
      .replace(/([\u2003]+)/g, '<span class="em_space">$1</span>')
      .replace(/\r\n/g, '\n').replace(/([^\n])[\n]$/, '$1') //.replace(/^[\r\n]/, '')
      //        .replace(/[\n]$/g, '<br><span class="han_space">|</span>')
      .replace(/[\n]/g, '<br>')
  ;

  // \u2001だけのグループ＝全角文字に隣接してない ≒ 半角に挟まれている
  htmlText = htmlText.replace(/(.)<group>([\u2001]+)<\/group>(.)/, '$1<group class="zen_space arial type2001">$2</group>$3');

  htmlText = htmlText.replace(/<group>/g, `<group class="${strongFont}">`);

  return htmlText;
};

NicoTextParser.likeHTML5 = text => {
  let htmlText =
    util.escapeHtml(text)
      .replace(/([\x20\xA0]+)/g, g => {
        return `<span class="html5_space" data-text="${encodeURIComponent(g)}">${'&nbsp;'.repeat(g.length)}</span>`;
      })
      .replace(/([\u2000\u2002]+)/g, g => {
        return `<span class="html5_space half" data-text="${encodeURIComponent(g)}">${g}</span>`;
      })
      .replace(/([\u3000\u2001\u2003]+)/g, g => {
        return `<span class="html5_zen_space" data-text="${encodeURIComponent(g)}">${'全'.repeat(g.length)}</span>`;
      })
      .replace(/[\u200B-\u200F]+/g, g => {
        return `<span class="html5_zero_width" data-text="${encodeURIComponent(g)}">${g}</span>`;
      })
      .replace(/([\t]+)/g, g => {
        return '<span class="html5_tab_space">' +
          '丁'.repeat(g.length * 2) + '</span>';
      })
      .replace(NicoTextParser._FONT_REG.BLOCK, '<span class="html5_block_space">$1</span>')
      .replace(/([\u2588]+)/g, g => {
        return '<span class="html5_fill_space u2588">' + //g + '</span>';
            '田'.repeat(g.length) + '</span>';
      })
      .replace(/[\n]/g, '<br>')
  ;

  let sp = htmlText.split('<br>');
  if (sp.length >= 101) {
    htmlText = `<span class="line101">${sp.slice(0, 101).join('<br>')}</span><span class="no-height">${sp.slice(101).join('<br>')}</span>`;
  } else if (sp.length >= 70) {
    htmlText = `<span class="line70">${sp.slice(0, 70).join('<br>')}</span><span class="no-height">${sp.slice(70).join('<br>')}</span>`;
  } else if (sp.length >= 53) {
    htmlText = `<span class="line53">${sp.slice(0,53).join('<br>')}</span><span class="no-height">${sp.slice(53).join('<br>')}</span>`;
  }

  return htmlText;
};
return NicoTextParser;
}

const NicoTextParser = NicoTextParserInitFunc();
ZenzaWatch.NicoTextParser = NicoTextParser;
//===END===

export {NicoTextParser, NicoTextParserInitFunc};
