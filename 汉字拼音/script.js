document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const inputText = document.getElementById('input-text');
    const generateBtn = document.getElementById('generate-btn');
    const hanziSizeSlider = document.getElementById('hanzi-size');
    const pinyinSizeSlider = document.getElementById('pinyin-size');
    const pinyinColor = document.getElementById('pinyin-color');
    const hanziSizeValue = document.getElementById('hanzi-size-value');
    const pinyinSizeValue = document.getElementById('pinyin-size-value');
    const resultContainer = document.getElementById('result-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    // 更新滑块值显示
    hanziSizeSlider.addEventListener('input', function() {
        hanziSizeValue.textContent = this.value;
    });
    
    pinyinSizeSlider.addEventListener('input', function() {
        pinyinSizeValue.textContent = this.value;
    });
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            showError('请输入要处理的汉字');
            return;
        }
        
        // 清空之前的结果
        resultContainer.innerHTML = '';
        errorElement.textContent = '';
        
        // 显示加载状态
        loadingElement.style.display = 'block';
        
        // 使用setTimeout让UI有机会更新
        setTimeout(() => {
            try {
                processText(text);
                loadingElement.style.display = 'none';
            } catch (error) {
                showError('处理过程中发生错误: ' + error.message);
                loadingElement.style.display = 'none';
            }
        }, 100);
    });
    
    function showError(message) {
        errorElement.textContent = message;
    }
    
    function processText(text) {
        // 获取设置
        const hanziSize = parseInt(hanziSizeSlider.value);
        const pinyinSize = parseInt(pinyinSizeSlider.value);
        const color = pinyinColor.value;
        
        // 处理每个字符
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // 检查是否是汉字
            if (!isChineseChar(char)) {
                continue;
            }
            
            // 获取拼音
            let pinyin = pinyinUtil.getPinyin(char, '', false, false);
            if (!pinyin) {
                continue;
            }
            
            // 创建结果容器
            const charContainer = document.createElement('div');
            charContainer.className = 'char-with-pinyin';
            
            // 创建canvas
            const canvas = document.createElement('canvas');
            canvas.className = 'char-canvas';
            canvas.width = hanziSize + 20;
            canvas.height = hanziSize + 20;
            
            // 绘制汉字和拼音
            drawCharWithPinyin(canvas, char, pinyin, hanziSize, pinyinSize, color);
            
            // 添加到DOM
            charContainer.appendChild(canvas);
            charContainer.appendChild(document.createTextNode(char));
            resultContainer.appendChild(charContainer);
        }
    }
    
    function isChineseChar(char) {
        const charCode = char.charCodeAt(0);
        return charCode >= 0x4E00 && charCode <= 0x9FA5;
    }
    
    function drawCharWithPinyin(canvas, char, pinyin, hanziSize, pinyinSize, color) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制汉字
        ctx.font = `${hanziSize}px "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(char, centerX, centerY);
        
        // 获取图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 找出汉字笔画区域（非白色像素）
        const strokePixels = [];
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                // 检查是否为非白色像素（考虑抗锯齿）
                if (data[index] < 250 || data[index+1] < 250 || data[index+2] < 250) {
                    strokePixels.push({x, y});
                }
            }
        }
        
        if (strokePixels.length === 0) return;
        
        // 找出空白区域（非笔画区域）
        const whitePixels = [];
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let isStroke = false;
                for (const pixel of strokePixels) {
                    if (pixel.x === x && pixel.y === y) {
                        isStroke = true;
                        break;
                    }
                }
                if (!isStroke) {
                    whitePixels.push({x, y});
                }
            }
        }
        
        if (whitePixels.length === 0) return;
        
        // 在空白区域放置拼音字母
        ctx.font = `${pinyinSize}px "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = color;
        
        const pinyinChars = pinyin.split('');
        const spacing = Math.floor(whitePixels.length / pinyinChars.length);
        
        for (let i = 0; i < pinyinChars.length; i++) {
            if (i * spacing >= whitePixels.length) break;
            
            const pos = whitePixels[i * spacing];
            ctx.fillText(pinyinChars[i], pos.x, pos.y);
        }
    }
    
    // 拼音工具配置
    const pinyinUtil = {
        getPinyin: function(char, splitter, lowerCase, firstLetter) {
            const result = pinyin(char, {
                style: firstLetter ? pinyin.STYLE_FIRST_LETTER : pinyin.STYLE_TONE,
                heteronym: false
            });
            
            if (!result || result.length === 0) return '';
            
            let pinyinStr = result[0][0];
            if (lowerCase) pinyinStr = pinyinStr.toLowerCase();
            if (firstLetter) pinyinStr = pinyinStr.charAt(0);
            
            return pinyinStr;
        }
    };
});