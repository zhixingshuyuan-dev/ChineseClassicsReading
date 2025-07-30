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
    const downloadAllBtn = document.getElementById('download-all');
    const progressElement = document.getElementById('progress');
    
    // 更新滑块值显示
    hanziSizeSlider.addEventListener('input', function() {
        hanziSizeValue.textContent = this.value;
    });
    
    pinyinSizeSlider.addEventListener('input', function() {
        pinyinSizeValue.textContent = this.value;
    });
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', async function() {
        const text = inputText.value.trim();
        if (!text) {
            showError('请输入要处理的汉字');
            return;
        }
        
        // 检查拼音库是否加载
        if (typeof window.pinyin === 'undefined') {
            showError('拼音库加载失败，请刷新页面重试');
            return;
        }
        
        // 清空之前的结果
        resultContainer.innerHTML = '';
        errorElement.textContent = '';
        downloadAllBtn.disabled = true;
        
        // 显示加载状态
        loadingElement.style.display = 'block';
        progressElement.textContent = '开始处理...';
        
        try {
            // 使用异步处理避免阻塞UI
            await processText(text);
            downloadAllBtn.disabled = false;
        } catch (error) {
            showError('处理过程中发生错误: ' + error.message);
            console.error(error);
        } finally {
            loadingElement.style.display = 'none';
        }
    });
    
    // 下载全部按钮点击事件
    downloadAllBtn.addEventListener('click', function() {
        const zip = new JSZip();
        const imgFolder = zip.folder("汉字拼音图片");
        let count = 0;
        
        document.querySelectorAll('.char-canvas').forEach((canvas, index) => {
            canvas.toBlob(function(blob) {
                const char = inputText.value.trim()[index];
                imgFolder.file(`${char}_拼音.png`, blob);
                count++;
                
                if (count === document.querySelectorAll('.char-canvas').length) {
                    zip.generateAsync({type: "blob"}).then(function(content) {
                        saveAs(content, "汉字拼音图片.zip");
                    });
                }
            }, 'image/png');
        });
    });
    
    function showError(message) {
        errorElement.textContent = message;
    }
    
    async function processText(text) {
        // 获取设置
        const hanziSize = parseInt(hanziSizeSlider.value);
        const pinyinSize = parseInt(pinyinSizeSlider.value);
        const color = pinyinColor.value;
        
        // 创建文档片段提高性能
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            progressElement.textContent = `正在处理 ${char} (${i+1}/${text.length})`;
            
            // 延迟以允许UI更新
            await new Promise(resolve => setTimeout(resolve, 0));
            
            // 检查是否是汉字
            if (!isChineseChar(char)) {
                continue;
            }
            
            // 获取拼音
            let pinyin = getPinyin(char);
            if (!pinyin || pinyin === char) {
                continue;
            }
            
            // 创建结果容器
            const charContainer = document.createElement('div');
            charContainer.className = 'char-with-pinyin';
            
            // 创建canvas
            const canvas = document.createElement('canvas');
            canvas.className = 'char-canvas';
            canvas.width = hanziSize + 40;  // 增加边距
            canvas.height = hanziSize + 40;
            
            // 绘制汉字和拼音
            await drawCharWithPinyin(canvas, char, pinyin, hanziSize, pinyinSize, color);
            
            // 添加到文档片段
            charContainer.appendChild(canvas);
            charContainer.appendChild(document.createTextNode(char));
            fragment.appendChild(charContainer);
        }
        
        // 一次性添加到DOM
        resultContainer.appendChild(fragment);
    }
    
    function isChineseChar(char) {
        const charCode = char.charCodeAt(0);
        return (charCode >= 0x4E00 && charCode <= 0x9FFF) || 
               (charCode >= 0x3400 && charCode <= 0x4DBF) ||
               (charCode >= 0x20000 && charCode <= 0x2A6DF);
    }
    
    function getPinyin(char) {
        try {
            const result = window.pinyin(char, {
                style: window.pinyin.STYLE_NORMAL,
                heteronym: false
            });
            return result?.[0]?.[0] || char;
        } catch (e) {
            console.error("拼音转换失败:", e);
            return char;
        }
    }
    
    function drawCharWithPinyin(canvas, char, pinyin, hanziSize, pinyinSize, color) {
        return new Promise(resolve => {
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
            
            if (strokePixels.length === 0) {
                resolve();
                return;
            }
            
            // 找出空白区域（非笔画区域）
            const whitePixels = [];
            const pixelMap = new Set(strokePixels.map(p => `${p.x},${p.y}`));
            
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    if (!pixelMap.has(`${x},${y}`)) {
                        whitePixels.push({x, y});
                    }
                }
            }
            
            if (whitePixels.length === 0) {
                resolve();
                return;
            }
            
            // 在空白区域放置拼音字母
            ctx.font = `${pinyinSize}px "Microsoft YaHei", sans-serif`;
            ctx.fillStyle = color;
            
            const pinyinChars = pinyin.split('');
            const spacing = Math.max(1, Math.floor(whitePixels.length / pinyinChars.length));
            
            for (let i = 0; i < pinyinChars.length; i++) {
                if (i * spacing >= whitePixels.length) break;
                
                const pos = whitePixels[i * spacing];
                ctx.fillText(pinyinChars[i], pos.x, pos.y);
            }
            
            resolve();
        });
    }
    
    // 动态加载zip库
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // 加载所需库
    Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
    ]).catch(err => {
        console.error('库加载失败:', err);
        showError('部分功能依赖加载失败，下载功能可能不可用');
    });
});
