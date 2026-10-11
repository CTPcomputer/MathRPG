/*:
 * @plugindesc GeoGebra 連接器 v6.0 —— GameBoy 配色，只凍結玩家移動，放行滑鼠
 * @author 你的名字
 *
 * @command OpenGeoGebra
 * @text 開啟 GeoGebra
 * @desc 開啟全螢幕 GameBoy 風格的 GeoGebra 介面，凍結玩家鍵盤與觸控輸入，放行滑鼠
 *
 * @help
 * 插件指令用法：
 * GeoGebraQuiz OpenGeoGebra
 *
 * 功能：
 *  1. 開啟全螢幕 GeoGebra 介面（Graphing Calculator）
 *  2. GameBoy 配色（淺綠背景、深綠座標軸、中綠曲線、深綠文字）
 *  3. 開啟期間玩家鍵盤／觸控輸入被凍結，無法移動或觸發事件
 *  4. 滑鼠事件完全放行，可以點擊、拖曳、輸入、捲動 GeoGebra
 *  5. 點擊「關閉」按鈕後輸入恢復
 */

(function() {
    'use strict';

    const PLUGIN_NAME = 'GeoGebraQuiz';
    const GEOGEBRA_SCRIPT_URL = 'https://www.geogebra.org/apps/deployggb.js';

    // ============================================================
    // GameBoy 配色
    // ============================================================
    const GB = {
        bg:       '#9BBC0F',
        dark:     '#0F380F',
        mid:      '#306230',
        light:    '#8BAC0F',
        rgbBg:    [155, 188, 15],
        rgbDark:  [15, 56, 15],
        rgbMid:   [48, 98, 48],
        rgbLight: [139, 172, 15]
    };

    // ============================================================
    // 執行時狀態
    // ============================================================
    let ggbContainer = null;
    let ggbReady = false;
    let isOpen = false;

    // 凍結鍵盤／觸控用
    const _Input_update = Input.update.bind(Input);
    const _Input_clear = Input.clear ? Input.clear.bind(Input) : null;
    let inputFrozen = false;

    // 鍵盤攔截函式（放行滑鼠，只攔鍵盤）
    function blockKey(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    // ============================================================
    // 工具
    // ============================================================
    function loadScript(url) {
        return new Promise(function(resolve, reject) {
            if (document.querySelector('script[src="' + url + '"]')) {
                resolve();
                return;
            }
            const s = document.createElement('script');
            s.src = url;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // ============================================================
    // 凍結／解凍玩家輸入
    // 只凍結鍵盤和觸控，滑鼠放行
    // ============================================================
    function freezeGameInput() {
        if (inputFrozen) return;

        // 清空按鍵狀態，玩家即使按住方向鍵也不會繼續移動
        if (_Input_clear) _Input_clear();
        Input._currentState = {};
        Input._currentState2 = {};
        Input._latestButton = null;
        Input._pressedTime = 0;
        Input._dir4 = 0;
        Input._dir8 = 0;

        // 替換 update 為空函式，鍵盤／觸控都讀不到
        Input.update = function() {};

        // 在 window 層攔截鍵盤事件
        window.addEventListener('keydown', blockKey, true);
        window.addEventListener('keyup', blockKey, true);
        window.addEventListener('keypress', blockKey, true);

        inputFrozen = true;
        console.log('[GeoGebraQuiz] 玩家鍵盤／觸控輸入已凍結，滑鼠放行');
    }

    function unfreezeGameInput() {
        if (!inputFrozen) return;

        window.removeEventListener('keydown', blockKey, true);
        window.removeEventListener('keyup', blockKey, true);
        window.removeEventListener('keypress', blockKey, true);

        Input.update = _Input_update;
        if (_Input_clear) _Input_clear();

        inputFrozen = false;
        console.log('[GeoGebraQuiz] 玩家輸入已恢復');
    }

    // ============================================================
    // UI
    // ============================================================
    function createUI() {
        const old = document.getElementById('ggb-quiz-overlay');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'ggb-quiz-overlay';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0', 'left: 0',
            'width: 100%', 'height: 100%',
            'background: ' + GB.dark,
            'z-index: 9999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            "font-family: 'Courier New', monospace"
        ].join(';');

        const frame = document.createElement('div');
        frame.style.cssText = [
            'background: ' + GB.mid,
            'padding: 20px',
            'border-radius: 12px',
            'box-shadow: 0 0 0 4px ' + GB.dark + ', 0 0 40px rgba(0,0,0,0.6)',
            'display: flex',
            'flex-direction: column',
            'align-items: center'
        ].join(';');

        const title = document.createElement('div');
        title.textContent = '▶ GeoGebra';
        title.style.cssText = [
            'color: ' + GB.dark,
            'background: ' + GB.light,
            'font-size: 16px',
            'padding: 8px 16px',
            'margin-bottom: 12px',
            'border-radius: 4px',
            'border: 2px solid ' + GB.dark,
            'letter-spacing: 1px'
        ].join(';');

        ggbContainer = document.createElement('div');
        ggbContainer.id = 'ggb-quiz-container';
        ggbContainer.style.cssText = [
            'width: 800px',
            'height: 560px',
            'border: 4px solid ' + GB.dark,
            'border-radius: 6px',
            'background: ' + GB.bg,
            'overflow: hidden',
            'position: relative'
        ].join(';');

        const buttonArea = document.createElement('div');
        buttonArea.style.cssText = 'margin-top: 16px; display: flex; gap: 16px;';

        const closeBtn = makeGBButton('關閉', closeQuiz);
        buttonArea.appendChild(closeBtn);

        frame.appendChild(title);
        frame.appendChild(ggbContainer);
        frame.appendChild(buttonArea);
        overlay.appendChild(frame);
        document.body.appendChild(overlay);
    }

    function makeGBButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = [
            'padding: 10px 28px',
            'font-size: 16px',
            "font-family: 'Courier New', monospace",
            'font-weight: bold',
            'background: ' + GB.light,
            'color: ' + GB.dark,
            'border: 3px solid ' + GB.dark,
            'border-radius: 6px',
            'cursor: pointer',
            'letter-spacing: 1px',
            'box-shadow: 3px 3px 0 ' + GB.dark,
            'transition: all 0.08s'
        ].join(';');
        btn.onmouseover = function() {
            btn.style.background = GB.mid;
            btn.style.color = GB.bg;
        };
        btn.onmouseout = function() {
            btn.style.background = GB.light;
            btn.style.color = GB.dark;
        };
        btn.onclick = onClick;
        return btn;
    }

    // ============================================================
    // GeoGebra 初始化
    // ============================================================
    function initGeoGebra() {
        if (!ggbContainer || ggbContainer.clientWidth === 0) {
            setTimeout(initGeoGebra, 200);
            return;
        }

        const params = {
            appName: 'graphing',
            width: ggbContainer.clientWidth,
            height: ggbContainer.clientHeight,
            showToolBar: false,
            showAlgebraInput: true,
            showMenuBar: false,
            showResetIcon: true,
            enableShiftDragZoom: true,
            language: 'zh_CN',
            perspective: 'G',
            ggbBase64: ''
        };

        window.ggbQuizApp = new GGBApplet(params, true);

        window.ggbQuizApp.inject('ggb-quiz-container', function() {
            ggbReady = true;
            console.log('[GeoGebraQuiz] GeoGebra 已就緒');
            // 延遲 500ms，等 GeoGebra 完成首幀渲染後再著色
            setTimeout(applyGameBoyTheme, 500);
        });

        // 輪詢兜底
        let tries = 0;
        const poll = setInterval(function() {
            tries++;
            const api = getApi();
            if (api && typeof api.evalCommand === 'function') {
                clearInterval(poll);
                if (!ggbReady) {
                    ggbReady = true;
                    setTimeout(applyGameBoyTheme, 500);
                }
            }
            if (tries > 50) clearInterval(poll);
        }, 200);
    }

    function getApi() {
        if (window.ggbQuizApp && typeof window.ggbQuizApp.getAppletObject === 'function') {
            return window.ggbQuizApp.getAppletObject();
        }
        if (window.ggbApplet) return window.ggbApplet;
        return null;
    }

    // ============================================================
    // GameBoy 主題
    // ============================================================
    function applyGameBoyTheme() {
        const api = getApi();
        if (!api) return;

        try {
            // 繪圖區背景
            api.setGraphicsOptions(1, { background: GB.rgbBg });
            // 座標軸顏色
            api.setAxesColor(GB.rgbDark[0], GB.rgbDark[1], GB.rgbDark[2]);
            // 網格
            api.setGridVisible(true);
            api.setGridColor(GB.rgbLight[0], GB.rgbLight[1], GB.rgbLight[2]);
            api.setGridLineStyle(0);
            // 座標軸標籤
            api.setAxisLabels(1, 'x', 'y');
            console.log('[GeoGebraQuiz] GeoGebra API 主題已套用');
        } catch (e) {
            console.error('[GeoGebraQuiz] API 主題失敗:', e);
        }

        // CSS 覆蓋 UI 元素
        applyCSSTheme();
    }

    function applyCSSTheme() {
        const old = document.getElementById('ggb-gb-theme');
        if (old) old.remove();

        const style = document.createElement('style');
        style.id = 'ggb-gb-theme';
        style.textContent = [
            // ---------- 容器整體 ----------
            '#ggb-quiz-container,',
            '#ggb-quiz-container .applet_scaler,',
            '#ggb-quiz-container .appletParameters {',
            '  background: ' + GB.bg + ' !important;',
            '}',

            // ---------- 所有文字預設深綠 ----------
            '#ggb-quiz-container,',
            '#ggb-quiz-container * {',
            '  color: ' + GB.dark + ' !important;',
            "  font-family: 'Courier New', monospace !important;",
            '}',

            // ---------- 代數區 ----------
            '#ggb-quiz-container .AlgebraView,',
            '#ggb-quiz-container .avItem,',
            '#ggb-quiz-container .avItemContent,',
            '#ggb-quiz-container .avItemRow,',
            '#ggb-quiz-container .avItemName,',
            '#ggb-quiz-container .avItemDescription,',
            '#ggb-quiz-container .gwt-ScrollPanel,',
            '#ggb-quiz-container .gwt-ScrollablePanel {',
            '  background: ' + GB.bg + ' !important;',
            '  color: ' + GB.dark + ' !important;',
            '}',

            // 代數區選取項
            '#ggb-quiz-container .avItem.selected,',
            '#ggb-quiz-container .avItemActive {',
            '  background: ' + GB.mid + ' !important;',
            '  color: ' + GB.bg + ' !important;',
            '}',

            // ---------- 輸入框 ----------
            '#ggb-quiz-container input,',
            '#ggb-quiz-container textarea,',
            '#ggb-quiz-container .gwt-TextBox,',
            '#ggb-quiz-container .gwt-PasswordTextBox,',
            '#ggb-quiz-container .avInput,',
            '#ggb-quiz-container .gwt-SuggestBox {',
            '  background: ' + GB.light + ' !important;',
            '  color: ' + GB.dark + ' !important;',
            '  border: 2px solid ' + GB.dark + ' !important;',
            '  caret-color: ' + GB.dark + ' !important;',
            '}',

            // ---------- 按鈕 ----------
            '#ggb-quiz-container button,',
            '#ggb-quiz-container .button,',
            '#ggb-quiz-container .gwt-Button,',
            '#ggb-quiz-container .gwt-ToggleButton,',
            '#ggb-quiz-container .gwt-PushButton {',
            '  background: ' + GB.light + ' !important;',
            '  color: ' + GB.dark + ' !important;',
            '  border: 2px solid ' + GB.dark + ' !important;',
            '  border-radius: 4px !important;',
            '}',

            // 按鈕 hover／選取
            '#ggb-quiz-container .gwt-Button:hover,',
            '#ggb-quiz-container .gwt-ToggleButton:hover,',
            '#ggb-quiz-container .gwt-ToggleButton-down,',
            '#ggb-quiz-container .gwt-ToggleButton-down-hovering {',
            '  background: ' + GB.mid + ' !important;',
            '  color: ' + GB.bg + ' !important;',
            '}',

            // ---------- 底部鍵盤／符號按鈕 ----------
            '#ggb-quiz-container .gwt-PushButton-up,',
            '#ggb-quiz-container .gwt-PushButton-up-hovering,',
            '#ggb-quiz-container .gwt-PushButton-down,',
            '#ggb-quiz-container .gwt-ToggleButton-up,',
            '#ggb-quiz-container .gwt-ToggleButton-up-hovering {',
            '  background: ' + GB.light + ' !important;',
            '  color: ' + GB.dark + ' !important;',
            '  border: 1px solid ' + GB.dark + ' !important;',
            '}',

            // ---------- 彈出選單 ----------
            '#ggb-quiz-container .gwt-SuggestBoxPopup,',
            '#ggb-quiz-container .gwt-PopupPanel,',
            '#ggb-quiz-container .gwt-MenuBar,',
            '#ggb-quiz-container .gwt-MenuBarPopup,',
            '#ggb-quiz-container .gwt-MenuItem {',
            '  background: ' + GB.bg + ' !important;',
            '  color: ' + GB.dark + ' !important;',
            '  border: 1px solid ' + GB.dark + ' !important;',
            '}',

            '#ggb-quiz-container .gwt-MenuItem-selected {',
            '  background: ' + GB.mid + ' !important;',
            '  color: ' + GB.bg + ' !important;',
            '}',

            // ---------- 面板／分隔條 ----------
            '#ggb-quiz-container .gwt-SplitLayoutPanel,',
            '#ggb-quiz-container .gwt-SplitLayoutPanel-Vertical,',
            '#ggb-quiz-container .gwt-SplitLayoutPanel-Horizontal {',
            '  background: ' + GB.bg + ' !important;',
            '  border-color: ' + GB.dark + ' !important;',
            '}',

            // ---------- Canvas（繪圖區）----------
            '#ggb-quiz-container canvas {',
            '  background: ' + GB.bg + ' !important;',
            '}',

            // ---------- 捲軸 ----------
            '#ggb-quiz-container ::-webkit-scrollbar {',
            '  width: 10px;',
            '  background: ' + GB.light + ';',
            '}',
            '#ggb-quiz-container ::-webkit-scrollbar-thumb {',
            '  background: ' + GB.dark + ';',
            '  border-radius: 5px;',
            '}',

            // ---------- 輸入提示文字顏色 ----------
            '#ggb-quiz-container ::placeholder {',
            '  color: ' + GB.mid + ' !important;',
            '  opacity: 0.7 !important;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
        console.log('[GeoGebraQuiz] CSS 主題已套用');
    }

    // ============================================================
    // 關閉
    // ============================================================
    function closeQuiz() {
        if (!isOpen) return;

        unfreezeGameInput();

        const overlay = document.getElementById('ggb-quiz-overlay');
        if (overlay) overlay.remove();

        const style = document.getElementById('ggb-gb-theme');
        if (style) style.remove();

        try {
            if (window.ggbQuizApp && window.ggbQuizApp.remove) {
                window.ggbQuizApp.remove();
            }
        } catch(e) {}

        ggbContainer = null;
        ggbReady = false;
        window.ggbQuizApp = null;
        isOpen = false;

        console.log('[GeoGebraQuiz] 已關閉');
    }

    // ============================================================
    // 插件指令
    // ============================================================
    PluginManager.registerCommand(PLUGIN_NAME, 'OpenGeoGebra', function() {
        if (isOpen) {
            console.warn('[GeoGebraQuiz] 已開啟，忽略重複呼叫');
            return;
        }
        isOpen = true;

        loadScript(GEOGEBRA_SCRIPT_URL)
            .then(function() {
                createUI();
                freezeGameInput();
                setTimeout(initGeoGebra, 100);
            })
            .catch(function() {
                isOpen = false;
                alert('無法載入 GeoGebra，請檢查網路連線。');
            });
    });

})();