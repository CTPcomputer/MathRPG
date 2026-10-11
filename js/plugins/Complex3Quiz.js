//=============================================================================
// Complex3Quiz.js — v8.1 DIAGNOSTIC
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v8.1 Complex3 native MZ scene with diagnostics.
 * @author 你的名字
 *
 * @command OpenComplex3
 * @text Open Complex3
 * @desc Opens Complex3.
 *
 * @arg formula
 * @type string
 * @text Formula
 * @desc Optional formula.
 * @default
 *
 * @help
 * Plugin Command: Complex3Quiz OpenComplex3
 */

console.log('=== Complex3Quiz.js v8.1 LOADED ===');
console.log('File loaded at:', new Date().toISOString());

(() => {
    'use strict';

    const PLUGIN_NAME = 'Complex3Quiz';
    const COMPLEX3_URL = 'https://hemisemidemipresent.github.io/complex3/';

    console.log('[C3] PLUGIN_NAME =', PLUGIN_NAME);
    console.log('[C3] typeof PluginManager =', typeof PluginManager);
    console.log('[C3] typeof Scene_Base =', typeof Scene_Base);

    const GB = {
        bg:       '#9BBC0F',
        dark:     '#0F380F',
        mid:      '#306230',
        light:    '#8BAC0F',
        lightest: '#E0F8D0',
        text:     '#0F380F'
    };

    //---------------------------------------------------------
    // Scene
    //---------------------------------------------------------
    function Scene_Complex3() {
        this.initialize.apply(this, arguments);
    }
    Scene_Complex3.prototype = Object.create(Scene_Base.prototype);
    Scene_Complex3.prototype.constructor = Scene_Complex3;

    Scene_Complex3.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this._url = COMPLEX3_URL;
        this._iframe = null;
        this._overlay = null;
        this._closeButton = null;
        console.log('[C3] Scene_Complex3.initialize');
    };

    Scene_Complex3.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        console.log('[C3] Scene_Complex3.create');
        this.createOverlay();
        this.createCloseButton();
        this.setupEscapeListener();
    };

    Scene_Complex3.prototype.createOverlay = function() {
        console.log('[C3] createOverlay start');
        const overlay = document.createElement('div');
        overlay.id = 'complex3-mz-overlay';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0', 'left: 0',
            'width: 100%', 'height: 100%',
            'z-index: 1000',
            'background: ' + GB.bg,
            'display: flex',
            'flex-direction: column'
        ].join(';');

        const bar = document.createElement('div');
        bar.style.cssText = [
            'height: 40px',
            'background: ' + GB.dark,
            'color: ' + GB.lightest,
            'display: flex',
            'align-items: center',
            'padding: 0 12px',
            'font-family: "Courier New", monospace',
            'font-weight: bold',
            'flex: 0 0 auto'
        ].join(';');
        bar.innerHTML = '<span>◉ COMPLEX3</span>';
        overlay.appendChild(bar);

        const container = document.createElement('div');
        container.id = 'complex3-mz-container';
        container.style.cssText = [
            'flex: 1 1 auto',
            'position: relative',
            'background: ' + GB.bg,
            'overflow: hidden'
        ].join(';');
        overlay.appendChild(container);

        document.body.appendChild(overlay);
        this._overlay = overlay;
        console.log('[C3] overlay appended to body. offsetWidth =', overlay.offsetWidth);

        // Force layout
        void container.offsetWidth;

        const iframe = document.createElement('iframe');
        iframe.src = this._url;
        iframe.allow = 'fullscreen';
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        iframe.style.cssText = [
            'width: 100%',
            'height: 100%',
            'border: 0',
            'display: block',
            'background: ' + GB.bg
        ].join(';');

        iframe.addEventListener('load', () => {
            console.log('[C3] iframe LOADED');
            try { iframe.contentWindow.focus(); } catch (e) {
                console.warn('[C3] focus failed:', e);
            }
        });
        iframe.addEventListener('error', (e) => {
            console.error('[C3] iframe ERROR:', e);
        });

        container.appendChild(iframe);
        this._iframe = iframe;
        console.log('[C3] iframe appended, src =', iframe.src);
    };

    Scene_Complex3.prototype.createCloseButton = function() {
        const btn = document.createElement('button');
        btn.textContent = '✕ 关闭';
        btn.style.cssText = [
            'position: fixed',
            'top: 4px',
            'right: 12px',
            'z-index: 1001',
            'background: ' + GB.light,
            'color: ' + GB.dark,
            'border: 2px solid ' + GB.lightest,
            'border-radius: 4px',
            'padding: 4px 12px',
            'font-family: "Courier New", monospace',
            'font-weight: bold',
            'cursor: pointer'
        ].join(';');
        btn.onclick = () => {
            console.log('[C3] close button clicked');
            SceneManager.pop();
        };
        document.body.appendChild(btn);
        this._closeButton = btn;
        console.log('[C3] close button appended');
    };

    Scene_Complex3.prototype.setupEscapeListener = function() {
        this._escHandler = (e) => {
            if (e.key === 'Escape' && SceneManager._scene === this) {
                console.log('[C3] Escape pressed');
                SceneManager.pop();
            }
        };
        window.addEventListener('keydown', this._escHandler, true);
    };

    Scene_Complex3.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this._startFrameCount = Graphics.frameCount;
        console.log('[C3] Scene_Complex3.start');
    };

    Scene_Complex3.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (Input.isTriggered('cancel') &&
            Graphics.frameCount > this._startFrameCount + 30) {
            console.log('[C3] cancel triggered');
            SceneManager.pop();
        }
    };

    Scene_Complex3.prototype.terminate = function() {
        console.log('[C3] Scene_Complex3.terminate');
        if (this._overlay) { this._overlay.remove(); this._overlay = null; }
        if (this._closeButton) { this._closeButton.remove(); this._closeButton = null; }
        if (this._escHandler) {
            window.removeEventListener('keydown', this._escHandler, true);
            this._escHandler = null;
        }
        this._iframe = null;
        try {
            const canvas = document.querySelector('canvas');
            if (canvas && canvas.focus) canvas.focus();
        } catch (e) {}
        Scene_Base.prototype.terminate.call(this);
    };

    window.Scene_Complex3 = Scene_Complex3;
    console.log('[C3] Scene_Complex3 registered on window');

    //---------------------------------------------------------
    // Plugin Command
    //---------------------------------------------------------
    if (typeof PluginManager !== 'undefined' && PluginManager.registerCommand) {
        PluginManager.registerCommand(PLUGIN_NAME, 'OpenComplex3', function(args) {
            console.log('[C3] Plugin command OpenComplex3 fired!', args);
            let url = COMPLEX3_URL;
            if (args && args.formula && args.formula.trim() !== '') {
                url += '?f=' + encodeURIComponent(args.formula.trim());
            }
            Scene_Complex3.prototype._pendingUrl = url;
            SceneManager.push(Scene_Complex3);
            console.log('[C3] SceneManager.push called');
        });
        console.log('[C3] registerCommand OK');
    } else {
        console.error('[C3] PluginManager.registerCommand NOT available');
    }

    window.Complex3Quiz = {
        open: (formula) => {
            let url = COMPLEX3_URL;
            if (formula) url += '?f=' + encodeURIComponent(formula);
            Scene_Complex3.prototype._pendingUrl = url;
            SceneManager.push(Scene_Complex3);
        },
        close: () => SceneManager.pop(),
        isOpen: () => SceneManager._scene instanceof Scene_Complex3
    };

    console.log('=== Complex3Quiz.js setup complete ===');
})();