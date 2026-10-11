/*:
 * @target MZ
 * @plugindesc 【V1.1.0】拼图小游戏 - 支持整图切割与坐标设置
 * @author Arrose (Modified by AI)
 * 
 * @url https://github.com/arrosev/RPGMakerMZPlugins
 * 
 * @help
 * 这个插件以MIT协议发布
 * 
 *  【V1.1.0 更新说明】
 *     1. 修改拼图逻辑为“整图切割”模式。只需提供一张大图，插件会自动分割。
 *     2. 添加了源图片截取坐标(x, y)和尺寸(width, height)设置。
 *     3. 添加了拼图行列数设置。
 *     4. 更新了预览窗口，支持直接显示原图。
 * 
 *    注意：
 *     1. 拼图成功之后会回到地图，执行的公共事件只会在回到地图页面后执行
 *     2. 拼图游戏窗口的大小取决于拼图游戏窗口单图块尺寸。
 *        如果设置了行列数，请确保 单图块尺寸 * 行列数 <= 源图片尺寸。
 * 
 * @command openJigsawGame
 * @text Open Jigsaw Game
 * @desc 打开拼图游戏
 * 
 * @arg sceneBackGroundImage
 * @text 背景图片
 * @desc 背景图片设置 (img/titles1)
 * @parent openJigsawGame
 * @type file
 * @dir img/titles1
 * @default
 * 
 * @arg sourceImage
 * @text 拼图源图片 (大图)
 * @desc 需要被切割的完整图片
 * @type file
 * @dir img/pictures
 * @default
 * 
 * @arg sourceX
 * @text 源图片截取 X
 * @desc 从大图的哪个X坐标开始截取
 * @parent sourceImage
 * @type number
 * @default 0
 * 
 * @arg sourceY
 * @text 源图片截取 Y
 * @desc 从大图的哪个Y坐标开始截取
 * @parent sourceImage
 * @type number
 * @default 0
 * 
 * @arg sourceWidth
 * @text 源图片截取 宽
 * @desc 截取多宽的区域 (0为自动计算)
 * @parent sourceImage
 * @type number
 * @default 0
 * 
 * @arg sourceHeight
 * @text 源图片截取 高
 * @desc 截取多高的区域 (0为自动计算)
 * @parent sourceImage
 * @type number
 * @default 0
 * 
 * @arg rows
 * @text 拼图行数
 * @desc 拼图切割成几行
 * @type number
 * @min 1
 * @default 3
 * 
 * @arg cols
 * @text 拼图列数
 * @desc 拼图切割成几列
 * @type number
 * @min 1
 * @default 3
 * 
 * @arg previewWindow
 * @text 预览窗口
 * @desc 预览窗口设置
 * @type string
 * @default
 * 
 * @arg previewWindowSkin
 * @text 预览窗口皮肤
 * @desc 预览窗口皮肤设置
 * @parent previewWindow
 * @type file
 * @dir img/system/
 * @default Window
 * 
 * @arg previewWindowRect
 * @text 预览窗口位置大小
 * @desc 预览窗口位置大小设置
 * @parent previewWindow
 * @type struct<Rect>
 * @default {"x":"0","y":"0","width":"0","height":"0"}
 * 
 * @arg previewWindowPadding
 * @text 预览窗口内边距
 * @desc 预览窗口内边距设置
 * @parent previewWindow
 * @type number
 * @default 12
 * 
 * @arg isShowPreviewWindow
 * @text 是否显示预览窗口
 * @desc 是否显示预览窗口设置
 * @parent previewWindow
 * @type boolean
 * @on 显示
 * @off 隐藏
 * @default true
 * 
 * @arg jigsawGameCommandWindow
 * @text 拼图游戏窗口
 * @desc 拼图游戏窗口设置
 * @type string
 * @default
 * 
 * @arg jigsawGameCommandWindowWindowSkin
 * @text 拼图游戏窗口皮肤
 * @desc 拼图游戏窗口皮肤设置
 * @parent jigsawGameCommandWindow
 * @type file
 * @dir img/system/
 * @default Window
 * 
 * @arg jigsawGameCommandWindowPoint
 * @text 拼图游戏窗口坐标
 * @desc 拼图游戏窗口坐标设置
 * @parent jigsawGameCommandWindow
 * @type struct<Point>
 * @default {"x":"0","y":"0"}
 * 
 * @arg jigsawGameCommandWindowImageSize
 * @text 拼图游戏窗口单图块尺寸
 * @desc 拼图游戏窗口单图块尺寸设置
 * @parent jigsawGameCommandWindow
 * @type struct<Size>
 * @default {"width":"0","height":"0"}
 * 
 * @arg jigsawGameCommandWindowPadding
 * @text 拼图游戏窗口内边距
 * @desc 拼图游戏窗口内边距设置
 * @parent jigsawGameCommandWindow
 * @type number
 * @default 12
 * 
 * @arg jigsawGameCommandWindowImageRowSpacing
 * @text 拼图游戏窗口按钮行间距
 * @desc 拼图游戏窗口按钮行间距设置
 * @parent jigsawGameCommandWindow
 * @type number
 * @default 4
 * 
 * @arg jigsawGameCommandWindowImageColSpacing
 * @text 拼图游戏窗口按钮列间距
 * @desc 拼图游戏窗口按钮列间距设置
 * @parent jigsawGameCommandWindow
 * @type number
 * @default 4
 * 
 * @arg isShowCancelButton
 * @text 是否显示返回按钮
 * @desc 是否显示返回按钮设置
 * @parent jigsawGameCommandWindow
 * @type boolean
 * @on 显示
 * @off 隐藏
 * @default true
 * 
 * @arg chooseImageCellTips
 * @text 被选中图块的提示图
 * @desc 被选中图块的提示图设置
 * @parent jigsawGameCommandWindow
 * @type file
 * @dir img/pictures
 * @default
 * 
 * @arg exchangeImageCellTips
 * @text 可交换图块的提示图
 * @desc 可交换图块的提示图设置
 * @parent jigsawGameCommandWindow
 * @type file
 * @dir img/pictures
 * @default
 * 
 * @arg commonEventAfterSuccess
 * @text 拼图成功之后执行的公共事件
 * @desc 拼图成功之后回到地图执行的公共事件设置
 * @parent jigsawGameCommandWindow
 * @type common_event
 * @default 0
 */

/*~struct~Point:
 * 
 * @param x
 * @text x坐标
 * @desc x坐标
 * @type number
 * @default 0
 * 
 * @param y
 * @text y坐标
 * @desc y坐标
 * @type number
 * @default 0
 * 
 */

/*~struct~Size:
 * 
 * @param width
 * @text 宽
 * @desc 宽
 * @type number
 * @min 0
 * @default 0
 * 
 * @param height
 * @text 高
 * @desc 高
 * @type number
 * @min 0
 * @default 0
 * 
 */

/*~struct~Rect:
 * 
 * @param x
 * @text x坐标
 * @desc x坐标
 * @type number
 * @default 0
 * 
 * @param y
 * @text y坐标
 * @desc y坐标
 * @type number
 * @default 0
 * 
 * @param width
 * @text 宽
 * @desc 宽
 * @type number
 * @min 0
 * @default 0
 * 
 * @param height
 * @text 高
 * @desc 高
 * @type number
 * @min 0
 * @default 0
 * 
 */

const ASJigsawGameNameSpace = (() => {
    "use strict";

    const pluginName = "ASJigsawGame";

    // --- 全局变量 ---
    let sceneBackGroundImage = undefined;

    // 预览窗口
    let previewWindowSkin = "Window";
    let previewWindowRect = new Rectangle(0, 0, 0, 0);
    let previewWindowPadding = 12;
    let isShowPreviewWindow = true;

    // 拼图核心数据
    let sourceImageName = ""; // 大图名称
    let sourceRect = new Rectangle(0, 0, 0, 0); // 截取区域
    let rows = 3;
    let cols = 3;
    let jigsawGameImageCellList = []; // 存储拼图块数据 {image, sx, sy, sw, sh, correctIndex}

    // 拼图窗口设置
    let jigsawGameCommandWindowWindowSkin = "Window";
    let jigsawGameCommandWindowPoint = new Point(0, 0);
    let jigsawGameCommandWindowImageSize = {width: 0, height: 0};
    let jigsawGameCommandWindowPadding = 12;
    let jigsawGameCommandWindowImageRowSpacing = 4;
    let jigsawGameCommandWindowImageColSpacing = 4;
    let jigsawGameCommandWindowMaxCols = 1; // 这里的列数是指游戏窗口的列数，通常等于拼图列数
    let isShowCancelButton = true;
    let chooseImageCellTips = undefined;
    let exchangeImageCellTips = undefined;
    let commonEventAfterSuccess = 0;

    let currentlySelectedIndex = -1;

    PluginManager.registerCommand(pluginName, "openJigsawGame", args => {

        currentlySelectedIndex = -1;

        sceneBackGroundImage = args.sceneBackGroundImage;

        // 预览窗口参数
        previewWindowSkin = args.previewWindowSkin;
        const previewWindowRectObject = JSON.parse(args.previewWindowRect);
        previewWindowRect = new Rectangle(Number(previewWindowRectObject.x) || 0, Number(previewWindowRectObject.y) || 0, Number(previewWindowRectObject.width) || 0, Number(previewWindowRectObject.height) || 0);
        previewWindowPadding = Number(args.previewWindowPadding);
        isShowPreviewWindow = args.isShowPreviewWindow !== "false";

        // 拼图源数据参数
        sourceImageName = args.sourceImage;
        sourceRect.x = Number(args.sourceX) || 0;
        sourceRect.y = Number(args.sourceY) || 0;
        sourceRect.width = Number(args.sourceWidth) || 0;
        sourceRect.height = Number(args.sourceHeight) || 0;
        rows = Number(args.rows) || 3;
        cols = Number(args.cols) || 3;

        // 拼图窗口参数
        jigsawGameCommandWindowWindowSkin = args.jigsawGameCommandWindowWindowSkin;
        const jigsawGameCommandWindowPointJsonObject = JSON.parse(args.jigsawGameCommandWindowPoint);
        jigsawGameCommandWindowPoint = new Point(Number(jigsawGameCommandWindowPointJsonObject.x) || 0, Number(jigsawGameCommandWindowPointJsonObject.y) || 0);
        const jigsawGameCommandWindowImageSizeJsonObject = JSON.parse(args.jigsawGameCommandWindowImageSize);
        jigsawGameCommandWindowImageSize = {
            width: Number(jigsawGameCommandWindowImageSizeJsonObject.width) || 0,
            height: Number(jigsawGameCommandWindowImageSizeJsonObject.height) || 0,
        };
        jigsawGameCommandWindowPadding = Number(args.jigsawGameCommandWindowPadding);
        jigsawGameCommandWindowImageRowSpacing = Number(args.jigsawGameCommandWindowImageRowSpacing);
        jigsawGameCommandWindowImageColSpacing = Number(args.jigsawGameCommandWindowImageColSpacing);
        
        // 自动设置游戏窗口的最大列数为拼图列数
        jigsawGameCommandWindowMaxCols = cols; 

        isShowCancelButton = args.isShowCancelButton !== "false";
        chooseImageCellTips = args.chooseImageCellTips;
        exchangeImageCellTips = args.exchangeImageCellTips;
        commonEventAfterSuccess = Number(args.commonEventAfterSuccess);

        // --- 核心逻辑：生成拼图块列表 ---
        jigsawGameImageCellList = [];
        
        // 如果未指定截取宽高，则默认使用单图块尺寸 * 行列数
        let finalWidth = sourceRect.width > 0 ? sourceRect.width : jigsawGameCommandWindowImageSize.width * cols;
        let finalHeight = sourceRect.height > 0 ? sourceRect.height : jigsawGameCommandWindowImageSize.height * rows;

        // 计算每个切片的宽高 (基于截取区域和行列数)
        let cellW = finalWidth / cols;
        let cellH = finalHeight / rows;

        // 生成切片数据
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // 计算该切片在源图中的坐标
                let sx = sourceRect.x + c * cellW;
                let sy = sourceRect.y + r * cellH;
                
                // 正确的位置索引 (1-based)
                let correctIndex = r * cols + c + 1;

                jigsawGameImageCellList.push({
                    image: sourceImageName, // 图片名
                    sx: sx,                 // 源图X
                    sy: sy,                 // 源图Y
                    sw: cellW,              // 源图宽
                    sh: cellH,              // 源图高
                    correctIndex: correctIndex // 正确位置
                });
            }
        }

        // 打乱列表 (Fisher-Yates 洗牌算法)
        for (let i = jigsawGameImageCellList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [jigsawGameImageCellList[i], jigsawGameImageCellList[j]] = [jigsawGameImageCellList[j], jigsawGameImageCellList[i]];
        }

        SceneManager.push(Scene_JigsawGame);
    });

    class Scene_JigsawGame extends Scene_MenuBase {

        create() {
            Scene_MenuBase.prototype.create.call(this);
            this.createPreviewWindow();
            this.createJigsawGameCommandWindow();
            if(isShowCancelButton) {
                this._jigsawGameCommandWindow.setHandler("cancel", this.popScene.bind(this));
            }
        }

        createBackground() {
            this._backgroundFilter = new PIXI.filters.BlurFilter();
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this._backgroundSprite.filters = [this._backgroundFilter];
            this.addChild(this._backgroundSprite);
            this.setBackgroundOpacity(192);
            if (sceneBackGroundImage) {
                this._backgroundSprite.bitmap = ImageManager.loadTitle1(sceneBackGroundImage);
                this._backgroundSprite.filters = [];
                this.setBackgroundOpacity(255);
            }
        };

        createPreviewWindow() {
            if (isShowPreviewWindow === true) {
                this._previewWindow = new Window_Preview(previewWindowRect);
                this._previewWindow._padding = previewWindowPadding;
                this.addChild(this._previewWindow);
            }
        }

        createJigsawGameCommandWindow() {
            // 窗口大小计算逻辑
            // 宽 = (单图块宽 + 间距) * 列数 + 内边距 * 2
            // 高 = (单图块高 + 间距) * 行数 + 内边距 * 2
            const windowWidth = (jigsawGameCommandWindowImageSize.width + jigsawGameCommandWindowImageColSpacing) * cols + jigsawGameCommandWindowPadding * 2;
            const windowHeight = (jigsawGameCommandWindowImageSize.height + jigsawGameCommandWindowImageRowSpacing) * rows + jigsawGameCommandWindowPadding * 2;

            const rect = new Rectangle(jigsawGameCommandWindowPoint.x, jigsawGameCommandWindowPoint.y, windowWidth, windowHeight);
            
            this._jigsawGameCommandWindow = new Window_JigsawGameCommand(rect);
            this._jigsawGameCommandWindow._padding = jigsawGameCommandWindowPadding;
            this.addChild(this._jigsawGameCommandWindow);
        }

        needsCancelButton() {
            return isShowCancelButton;
        }
    }

    class Window_Preview extends Window_Base {
        initialize(rect) {
            Window_Base.prototype.initialize.call(this, rect);
            this.windowskin = ImageManager.loadSystem(previewWindowSkin);
            
            // 直接加载源图片进行预览
            if (sourceImageName) {
                const bitmap = ImageManager.loadPicture(sourceImageName);
                bitmap.addLoadListener(() => {
                    this.contents.clear();
                    // 绘制截取区域
                    let sx = sourceRect.x;
                    let sy = sourceRect.y;
                    let sw = sourceRect.width > 0 ? sourceRect.width : bitmap.width;
                    let sh = sourceRect.height > 0 ? sourceRect.height : bitmap.height;

                    this.contents.blt(bitmap, sx, sy, sw, sh, 0, 0, this.contents.width, this.contents.height);
                });
            }
        }
    }

    class Window_JigsawGameCommand extends Window_HorzCommand {

        initialize(rect) {
            Window_HorzCommand.prototype.initialize.call(this, rect);
            this.windowskin = ImageManager.loadSystem(jigsawGameCommandWindowWindowSkin);
        }

        makeCommandList() {
            // 遍历生成的拼图块列表
            for (let index = 0; index < jigsawGameImageCellList.length; index ++) {
                // 命令名称使用索引，处理函数中会用到
                this.addCommand(String(index), `${index}`);
            }
            for (const command of this._list) {
                this.setHandler(command.symbol, this.commandActionBind.bind(this, Number(command.symbol) || 0));
            }
        }

        commandActionBind(index) {
            this.contents.clear();
            if (currentlySelectedIndex === -1) {
                // 初始未选中状态
                const nearbyCellIndexList = this.getNearbyCellIndexList(index);
                currentlySelectedIndex = index;
                this.drawItem(currentlySelectedIndex);
                for (const index of nearbyCellIndexList) {
                    this.drawItem(index);
                }
            } else {
                const lastCellIndexList = this.getNearbyCellIndexList(currentlySelectedIndex);
                if (lastCellIndexList.includes(index) || lastCellIndexList.length === 0) {
                    // 交换数据
                    let temp = jigsawGameImageCellList[currentlySelectedIndex];
                    jigsawGameImageCellList[currentlySelectedIndex] = jigsawGameImageCellList[index];
                    jigsawGameImageCellList[index] = temp;
                    
                    this.drawItemBackground(currentlySelectedIndex);
                    this.drawItemBackground(index);
                    currentlySelectedIndex = -1;
                    
                    // 判断是否拼图成功
                    let succeed = true;
                    for (let i = 0; i < jigsawGameImageCellList.length; i ++) {
                        // 当前显示的位置 (1-based)
                        const currentPos = i + 1;
                        // 该图块原本应该在的位置
                        const correctPos = Number(jigsawGameImageCellList[i].correctIndex);
                        
                        if(currentPos !== correctPos) {
                            succeed = false;
                            break;
                        }
                    }
                    if (succeed === true) {
                        if (commonEventAfterSuccess !== 0) {
                            $gameMap._interpreter.command117([commonEventAfterSuccess]);
                        }
                        this.parent.popScene();
                    }
                } else {
                    // 点击了不相邻的格子，切换选中状态
                    const nearbyCellIndexList = this.getNearbyCellIndexList(index);
                    currentlySelectedIndex = index;
                    this.drawItem(currentlySelectedIndex);
                    for (const index of nearbyCellIndexList) {
                        this.drawItem(index);
                    }
                }
            }
            this.activate();
        }

        getNearbyCellIndexList(index) {
            const left = index - 1;
            const top = index - cols; // 使用配置的列数
            const right = index + 1;
            const bottom = index + cols; // 使用配置的列数
            const list = [];
            
            // 判断左边界
            if (index % cols !== 0) {
                list.push(left);
            }
            // 判断上边界
            if (index - cols >= 0) {
                list.push(top);
            }
            // 判断右边界
            if ((index + 1) % cols !== 0 && (index + 1) < jigsawGameImageCellList.length) {
                list.push(right);
            }
            // 判断下边界
            if (index + cols < jigsawGameImageCellList.length) {
                list.push(bottom);
            }
            return list;
        }

        drawItem(index) {
            if (currentlySelectedIndex !== -1) {
                const rect = this.itemRect(index);
                const image = index === currentlySelectedIndex ? chooseImageCellTips : exchangeImageCellTips;
                if (image) {
                    const bitmap = ImageManager.loadPicture(image);
                    bitmap.addLoadListener(() => {
                        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
                        // 这里强制拉伸提示图以适应格子大小
                        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x, rect.y, rect.width, rect.height);
                    });
                }
            }
        }

        drawItemBackground(index) {
            const rect = this.itemRect(index);
            const data = jigsawGameImageCellList[index];
            
            // 从源大图中裁剪出对应部分绘制
            const bitmap = ImageManager.loadPicture(data.image);
            bitmap.addLoadListener(() => {
                this.contentsBack.clearRect(rect.x, rect.y, rect.width, rect.height);
                // blt(source, sx, sy, sw, sh, dx, dy, dw, dh)
                this.contentsBack.blt(
                    bitmap, 
                    data.sx, data.sy, data.sw, data.sh, 
                    rect.x, rect.y, rect.width, rect.height
                );
            });
        }

        maxCols() {
            return cols;
        };

        colSpacing() {
            return jigsawGameCommandWindowImageColSpacing;
        }

        rowSpacing() {
            return jigsawGameCommandWindowImageRowSpacing;
        }

        itemWidth() {
            return jigsawGameCommandWindowImageSize.width + this.colSpacing();
        }

        itemHeight() {
            return jigsawGameCommandWindowImageSize.height + this.rowSpacing();
        }

    }

})();