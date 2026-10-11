/*:
 * @target MZ
 * @plugindesc Game Boy style title menu + move game title to the upper area
 * @author 
 * @help
 * - Draws the game title in the upper part of the title screen.
 * - Turns the title command window into a plain vertical list
 *   (no box) with a Game Boy green palette and arrow cursor.
 *
 * @param palette2
 * @text Dark green
 * @desc Disabled text color.
 * @default #306230
 *
 * @param palette3
 * @text Darkest green
 * @desc Normal text color and cursor color.
 * @default #0f380f
 *
 * @param fontSize
 * @text Menu font size
 * @desc Font size of the title command list.
 * @default 20
 *
 * @param fontFace
 * @text Font face
 * @desc Optional pixel font name. Leave empty for default.
 * @default 
 *
 * @param marginBottom
 * @text Menu bottom margin
 * @desc Distance from the bottom of the screen to the menu list.
 * @default 48
 *
 * @param lineSpacing
 * @text Line spacing
 * @desc Extra vertical space between menu commands (px).
 * @default 8
 *
 * @param cursorMode
 * @text Cursor mode
 * @desc How the selected item is highlighted: "arrow", "underline", or "both".
 * @default arrow
 *
 * @param titleY
 * @text Title Y position
 * @desc Vertical position of the game title. Smaller = higher.
 * @default 60
 *
 * @param titleFontSize
 * @text Title font size
 * @desc Font size of the game title.
 * @default 72
 *
 * @param titleColor
 * @text Title color
 * @desc Text color of the game title.
 * @default #ffffff
 *
 * @param titleOutlineColor
 * @text Title outline color
 * @desc Outline color of the game title.
 * @default rgba(0,0,0,0.7)
 *
 * @param titleOutlineWidth
 * @text Title outline width
 * @desc Outline width of the game title.
 * @default 8
 */

(() => {
    const pluginName = "GameBoyTitleMenu";
    const params = PluginManager.parameters(pluginName);

    const C2 = String(params["palette2"] || "#00ff00");
    const C3 = String(params["palette3"] || "#00ff00");

    const FONT_SIZE = Number(params["fontSize"] || 20);
    const FONT_FACE = String(params["fontFace"] || "").trim();
    const MARGIN_B = Number(params["marginBottom"] || 48);
    const SPACING = Number(params["lineSpacing"] || 8);
    const CURSOR_MODE = String(params["cursorMode"] || "arrow").toLowerCase();

    const TITLE_Y = Number(params["titleY"] || 60);
    const TITLE_SIZE = Number(params["titleFontSize"] || 72);
    const TITLE_COLOR = String(params["titleColor"] || "#ffffff");
    const TITLE_OUTLINE = String(params["titleOutlineColor"] || "rgba(0,0,0,0.7)");
    const TITLE_OUTLINE_W = Number(params["titleOutlineWidth"] || 8);

    //=========================================================================
    // PART A — Move the game title to the upper area
    //=========================================================================
    Scene_Title.prototype.drawGameTitle = function() {
        const x = 20;
        const y = TITLE_Y;                       // <-- moved up
        const maxWidth = Graphics.width - x * 2;
        const text = $dataSystem.gameTitle;
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.outlineColor = TITLE_OUTLINE;
        bitmap.outlineWidth = TITLE_OUTLINE_W;
        bitmap.fontSize = TITLE_SIZE;
        bitmap.textColor = TITLE_COLOR;
        bitmap.drawText(text, x, y, maxWidth, 96, "center");
    };

    //=========================================================================
    // PART B — Game Boy vertical list at the bottom
    //=========================================================================

    // 1) Position: bottom of the screen, centered horizontally
    const _commandWindowRect = Scene_Title.prototype.commandWindowRect;
    Scene_Title.prototype.commandWindowRect = function() {
        const rect = _commandWindowRect.call(this);
        const ww = rect.width;
        const itemH = FONT_SIZE + SPACING;
        const wh = itemH * 3 + 16;
        const wx = Math.floor((Graphics.boxWidth - ww) / 2);
        const wy = Graphics.boxHeight - wh - MARGIN_B;
        return new Rectangle(wx, wy, ww, wh);
    };

    // 2) No box background and no frame
    Window_TitleCommand.prototype._refreshBack = function() {
        const sprite = this._backSprite;
        const tilingSprite = sprite.children[0];
        if (tilingSprite) tilingSprite.visible = false;
        sprite.visible = false;
    };

    Window_TitleCommand.prototype._refreshFrame = function() {
        for (const child of this._frameSprite.children) {
            child.visible = false;
        }
    };

    // 3) Row height and spacing
    const _itemHeight = Window_Selectable.prototype.itemHeight;
    Window_Selectable.prototype.itemHeight = function() {
        if (this instanceof Window_TitleCommand) {
            return FONT_SIZE + SPACING;
        }
        return _itemHeight.call(this);
    };

    // 4) Cursor: arrow / underline / both
    Window_TitleCommand.prototype._refreshCursor = function() {
        const children = this._cursorSprite.children;
        for (let i = 0; i < 8; i++) {
            if (children[i]) children[i].visible = false;
        }
        const drect = this._cursorRect.clone();

        if (CURSOR_MODE === "underline" || CURSOR_MODE === "both") {
            if (children[8]) {
                const lw = Math.max(1, drect.width);
                const lh = 4;
                if (!children[8].bitmap || children[8].bitmap.width !== lw || children[8].bitmap.height !== lh) {
                    children[8].bitmap = new Bitmap(lw, lh);
                }
                children[8].bitmap.fillAll(C3);
                children[8].setFrame(0, 0, lw, lh);
                children[8].move(0, drect.height - lh);
                children[8].visible = true;
            }
        } else if (CURSOR_MODE === "arrow") {
            if (children[8]) {
                const aw = 12;
                const ah = FONT_SIZE;
                if (!children[8].bitmap || children[8].bitmap.width !== aw || children[8].bitmap.height !== ah) {
                    children[8].bitmap = new Bitmap(aw, ah);
                }
                children[8].bitmap.clear();
                const ctx = children[8].bitmap.context;
                ctx.fillStyle = C3;
                for (let y = 0; y < ah; y++) {
                    const half = Math.floor(ah / 2);
                    const w = half - Math.abs(y - half) + 1;
                    ctx.fillRect(0, y, w, 1);
                }
                children[8].setFrame(0, 0, aw, ah);
                children[8].move(0, 0);
                children[8].visible = true;
            }
        }
        this._cursorSprite.x = drect.x;
        this._cursorSprite.y = drect.y;
    };

    // 5) Text drawing: green, no outline, indented if arrow cursor
    const _Window_Command_drawItem = Window_Command.prototype.drawItem;
    Window_Command.prototype.drawItem = function(index) {
        if (!(this instanceof Window_TitleCommand)) {
            return _Window_Command_drawItem.call(this, index);
        }
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();

        if (FONT_FACE) this.contents.fontFace = FONT_FACE;
        this.contents.fontSize = FONT_SIZE;
        this.contents.outlineWidth = 0;
        this.contents.outlineColor = "rgba(0,0,0,0)";
        this.contents.textColor = this.isCommandEnabled(index) ? C3 : C2;
        this.contents.paintOpacity = 255;

        const indent = CURSOR_MODE === "arrow" ? 20 : 0;
        this.drawText(this.commandName(index), rect.x + indent, rect.y, rect.width - indent, align);
    };

    // 6) Rebuild with our custom parts, no window chrome
    const _Window_TitleCommand_initialize = Window_TitleCommand.prototype.initialize;
    Window_TitleCommand.prototype.initialize = function(rect) {
        _Window_TitleCommand_initialize.call(this, rect);
        this.setTone(0, 0, 0);
        this.backOpacity = 0;
        this.opacity = 0;
        this.frameVisible = false;
        this._refreshAllParts();
    };

    const _Window_onWindowskinLoad = Window.prototype._onWindowskinLoad;
    Window.prototype._onWindowskinLoad = function() {
        _Window_onWindowskinLoad.call(this);
        if (this instanceof Window_TitleCommand) {
            this.setTone(0, 0, 0);
            this.backOpacity = 0;
            this.opacity = 0;
            this.frameVisible = false;
            this._refreshAllParts();
        }
    };
})();