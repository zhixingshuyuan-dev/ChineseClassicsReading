// 初始化数据
const poemText = [
  "好雨知时节，当春乃发生。",
  "随风潜入夜，润物细无声。",
  "野径云俱黑，江船火独明。",
  "晓看红湿处，花重锦官城。",
];

// 更新通知
function showNotification(message) {
  const notification = document.getElementById("updateNotification");
  notification.querySelector("span").textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// 检测输入变化
function detectChanges() {
  // 检测诗句变化
  const lineInputs = document.querySelectorAll(".line-input");
  lineInputs.forEach((input) => {
    const original = input.getAttribute("data-original");
    const current = input.value;

    const lineDiv = input.closest(".poem-line");
    if (current !== original) {
      lineDiv.classList.add("editing");
    } else {
      lineDiv.classList.remove("editing");
    }
  });

  // 检测字符卡片变化
  const charCards = document.querySelectorAll(".character-card");
  charCards.forEach((card) => {
    const inputs = card.querySelectorAll(".char-input");
    let hasChanges = false;

    inputs.forEach((input) => {
      const original = input.getAttribute("data-original");
      if (input.value !== original) {
        hasChanges = true;
      }
    });

    if (hasChanges) {
      card.classList.add("editing");
    } else {
      card.classList.remove("editing");
    }
  });

  // 检测整句翻译变化
  const translationInputs = document.querySelectorAll(
    ".translation-table input"
  );
  translationInputs.forEach((input) => {
    const original = input.getAttribute("data-original");
    const current = input.value;

    const row = input.closest("tr");
    if (current !== original) {
      row.classList.add("editing");
    } else {
      row.classList.remove("editing");
    }
  });
}

// 保存字符数据
function saveCharData() {
  const charCards = document.querySelectorAll(".character-card");
  charCards.forEach((card) => {
    const inputs = card.querySelectorAll(".char-input");
    inputs.forEach((input) => {
      input.setAttribute("data-original", input.value);
    });
    card.classList.remove("editing");
  });
  showNotification("字符数据已保存！");
}

// 重置所有更改
function resetAllChanges() {
  // 重置诗句
  const lineInputs = document.querySelectorAll(".line-input");
  lineInputs.forEach((input) => {
    const original = input.getAttribute("data-original");
    input.value = original;
    input.closest(".poem-line").classList.remove("editing");
  });

  // 重置字符数据
  const charInputs = document.querySelectorAll(".char-input");
  charInputs.forEach((input) => {
    const original = input.getAttribute("data-original");
    input.value = original;
    input.closest(".character-card").classList.remove("editing");
  });

  // 重置整句翻译
  const translationInputs = document.querySelectorAll(
    ".translation-table input"
  );
  translationInputs.forEach((input) => {
    const original = input.getAttribute("data-original");
    input.value = original;
    input.closest("tr").classList.remove("editing");
  });

  showNotification("所有更改已重置！");
}

// 添加新行
function addNewLine() {
  const poemLines = document.getElementById("poemLines");
  const lineCount = poemLines.children.length + 1;

  const newLine = document.createElement("div");
  newLine.className = "poem-line";
  newLine.innerHTML = `
    <div class="line-number">${lineCount}</div>
    <input type="text" class="line-input" placeholder="输入诗句..." data-original="">
  `;
  poemLines.appendChild(newLine);

  // 添加新行的翻译
  const tbody = document.getElementById("translationBody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${lineCount}</td>
    <td></td>
    <td><input type="text" placeholder="输入翻译..." data-original=""></td>
  `;
  tbody.appendChild(newRow);

  // 更新原句显示
  updateOriginalTexts();

  showNotification("新行已添加！");
}

// 重新解析字符
function reparseCharacters() {
  let allText = "";
  document.querySelectorAll(".line-input").forEach((input) => {
    if (input.value) allText += input.value;
  });

  // 提取唯一汉字
  const uniqueChars = [...new Set(allText.split(""))].filter((char) =>
    /[\u4e00-\u9fa5]/.test(char)
  );

  const grid = document.getElementById("charactersGrid");
  grid.innerHTML = "";

  uniqueChars.forEach((char) => {
    const card = document.createElement("div");
    card.className = "character-card";
    card.innerHTML = `
      <div class="char-display">${char}</div>
      <div class="edit-indicator">!</div>
      <div class="char-input-group">
        <label>拼音</label>
        <input type="text" class="char-input" placeholder="输入拼音" data-original="">
      </div>
      <div class="char-input-group">
        <label>英文翻译</label>
        <input type="text" class="char-input" placeholder="输入翻译" data-original="">
      </div>
      <div class="char-input-group">
        <label>德文翻译</label>
        <input type="text" class="char-input" placeholder="输入翻译" data-original="">
      </div>
        <div class="char-input-group">
        <label>法文翻译</label>
        <input type="text" class="char-input" placeholder="输入翻译" data-original="">
      </div>

        <div class="char-input-group">
        <label>西班牙文翻译</label>
        <input type="text" class="char-input" placeholder="输入翻译" data-original="">
      </div>



      <div class="char-input-group">
        <label>意大利文翻译</label>
        <input type="text" class="char-input" placeholder="输入翻译" data-original="">
      </div>
    `;
    grid.appendChild(card);
  });

  // 更新原句显示
  updateOriginalTexts();

  showNotification("字符已重新解析！");
}

// 更新原句显示
function updateOriginalTexts() {
  const rows = document.querySelectorAll("#translationBody tr");
  const lineInputs = document.querySelectorAll(".line-input");

  lineInputs.forEach((input, index) => {
    if (rows[index]) {
      rows[index].cells[1].textContent = input.value;
    }
  });
}

// 刷新预览
function refreshPreview() {
  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";

  const lines = [];
  document.querySelectorAll(".line-input").forEach((input) => {
    if (input.value) lines.push(input.value);
  });

  lines.forEach((line, index) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "preview-line";

    line.split("").forEach((char) => {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        // 查找拼音和翻译
        let pinyin = "?";
        let translation = "?";
        const charCard = Array.from(
          document.querySelectorAll(".character-card")
        ).find(
          (card) => card.querySelector(".char-display").textContent === char
        );

        if (charCard) {
          pinyin = charCard.querySelectorAll(".char-input")[0].value || "?";
          translation =
            charCard.querySelectorAll(".char-input")[1].value || "?";
        }

        lineDiv.innerHTML += `
          <span class="preview-char">
            ${char}
            <span class="preview-info">
              <span class="preview-pinyin">${pinyin}</span>
              <span class="preview-trans">${translation}</span>
            </span>
          </span>
        `;
      } else {
        lineDiv.innerHTML += `<span class="trans">${char}</span>`;
      }
    });

    previewContainer.appendChild(lineDiv);

    // 添加整句翻译预览
    const translationRow = document.querySelectorAll("#translationBody tr")[
      index
    ];
    if (translationRow) {
      const translation = translationRow.querySelector("input").value;
      const translationDiv = document.createElement("div");
      translationDiv.className = "preview-translation";

      // 获取当前语言
      const lang = document.querySelector(".lang-btn.active").dataset.lang;

      // 根据语言显示标签
      const langLabel =
        {
          en: "English: ",
          zh: "中文: ",
          de: "Deutsche: ",
          fr: "française: ",
          es: "español: ",
          it: "italiano: "
        }[lang] || "Translation: ";

      translationDiv.innerHTML = `<strong>${langLabel}</strong>${
        translation || "无翻译"
      }`;
      previewContainer.appendChild(translationDiv);
    }
  });

  showNotification("预览已刷新！");
}

function jsonToMaps(data) {
  const poemText = data.poemText;

  // Pinyin Map
  const pinyinMap = new Map(Object.entries(data.pinyinData || {}));

  // Word-level translation maps (e.g., en, de, it, es, fr)
  const translationMaps = {};
  for (const [lang, translations] of Object.entries(data.translations || {})) {
    translationMaps[lang] = new Map(Object.entries(translations));
  }

  // Line-level translation maps (e.g., en, de, it, es, fr)
  const lineTranslationMaps = {};
  for (const [lang, lineTranslations] of Object.entries(
    data.lineTranslations || {}
  )) {
    lineTranslationMaps[lang] = new Map(Object.entries(lineTranslations));
  }

  return {
    poemText,
    pinyinMap,
    translationMaps,
    lineTranslationMaps,
  };
}

// 导出为JSON
function exportToJson() {
  const data = {
    poemText: "",
    pinyinData: {},
    translations: {
      en: {},
      de: {},
      it: {},
      fr: {},
      es: {}
    },
    lineTranslations: {
      en: {},
      de: {},
      it: {},
      fr: {},
      es: {}
    },
  };

  // 收集诗句
  const lines = [];
  document.querySelectorAll(".line-input").forEach((input) => {
    lines.push(input.value);
  });
  data.poemText = lines.join("\n");

  // 收集字符数据
  document.querySelectorAll(".character-card").forEach((card) => {
    const char = card.querySelector(".char-display").textContent;
    const inputs = card.querySelectorAll(".char-input");
    data.pinyinData[char] = inputs[0].value;
    data.translations.en[char] = inputs[1].value;
    data.translations.de[char] = inputs[2].value;
    data.translations.it[char] = inputs[3].value;
  });

  // 收集整句翻译 (多语言)
  const langBtns = document.querySelectorAll(".lang-btn");
  const rows = document.querySelectorAll("#translationBody tr");

  for (let langBtn of langBtns) {
    const lang = langBtn.dataset.lang;
    if (!["en", "de", "fr", "es", "it"].includes(lang)) continue;

    langBtns.forEach((b) => b.classList.remove("active"));
    langBtn.classList.add("active");

    rows.forEach((row, index) => {
      const original = row.cells[1].textContent;
      const input = row.querySelector("input");
      if (input) {
        const value = input.value;
        data.lineTranslations[lang][original] = value;
      }
    });
  }

  const poemData = JSON.stringify(data, null, 2);
  console.log(poemData);
  const result = jsonToMaps(JSON.parse(poemData));
  const jsonString = JSON.stringify({
    poemText: result.poemText,
    pinyinData: Object.fromEntries(result.pinyinMap),
    translations: Object.fromEntries(
      Object.entries(result.translationMaps).map(([lang, map]) => [
        lang,
        Object.fromEntries(map),
      ])
    ),
    lineTranslations: Object.fromEntries(
      Object.entries(result.lineTranslationMaps).map(([lang, map]) => [
        lang,
        Object.fromEntries(map),
      ])
    ),
  });
  return jsonString;
}

// 自动生成拼音
function generatePinyin() {
  const charCards = document.querySelectorAll(".character-card");

  charCards.forEach((card) => {
    const char = card.querySelector(".char-display").textContent;
    const pinyinInput = card.querySelectorAll(".char-input")[0];

    try {
      const pinyin = pinyinPro.pinyin(char, { toneType: "num" });
      pinyinInput.value = pinyin;
    } catch (e) {
      pinyinInput.value = "?";
    }
  });

  showNotification("拼音已自动生成！");
}

// 自动生成翻译
async function generateTranslation() {
  const charCards = document.querySelectorAll(".character-card");

  for (const card of charCards) {
    const char = card.querySelector(".char-display").textContent;
    const inputs = card.querySelectorAll(".char-input");

    // 英文翻译
    try {
      const enRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          char
        )}&langpair=zh|en`
      );
      const enData = await enRes.json();
      inputs[1].value = enData.responseData.translatedText || "?";
    } catch {
      inputs[1].value = "?";
    }

    // 德文翻译
    try {
      const deRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          char
        )}&langpair=zh|de`
      );
      const deData = await deRes.json();
      inputs[2].value = deData.responseData.translatedText || "?";
    } catch {
      inputs[2].value = "?";
    }


// 意大利文翻译
    try {
      const itRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          char
        )}&langpair=zh|it`
      );
      const itData = await itRes.json();
      inputs[3].value = itData.responseData.translatedText || "?";
    } catch {
      inputs[3].value = "?";
    }

    // 法文翻译
    try {
      const françaiseRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          char
        )}&langpair=zh|fr`
      );
      const deData = await deRes.json();
      inputs[4].value = deData.responseData.translatedText || "?";
    } catch {
      inputs[4].value = "?";
    }


      // 西班牙文翻译
    try {
      const españolRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          char
        )}&langpair=zh|es`
      );
      const deData = await deRes.json();
      inputs[5].value = deData.responseData.translatedText || "?";
    } catch {
      inputs[5].value = "?";
    }




    

    // 避免API限制
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  refreshPreview();
  showNotification("字符翻译已自动生成！");
}

// 模拟API翻译函数
async function translateText(text, targetLang = "en") {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh|${targetLang}`);
    const data = await res.json();
    return data.responseData.translatedText || "[翻译失败]";
}

// 自动翻译整句
async function autoTranslateLine(lineIndex) {
  const loader = document.getElementById("translationLoader");
  loader.style.display = "block";

  const rows = document.querySelectorAll("#translationBody tr");

  if (lineIndex >= rows.length) {
    showNotification("行号无效，无法翻译！");
    loader.style.display = "none";
    return;
  }

  const row = rows[lineIndex];
  const original = row.cells[1].textContent;
  const input = row.querySelector("input");

  // 获取目标语言
  const lang = document.querySelector(".lang-btn.active").dataset.lang || "en";

  try {
    const translation = await translateText(original, lang);
    input.value = translation;
    loader.style.display = "none";
    showNotification(`第${lineIndex + 1}行已翻译！`);
    refreshPreview();
  } catch (error) {
    console.error("翻译失败:", error);
    input.value = "翻译失败，请重试";
    loader.style.display = "none";
    showNotification("翻译失败！");
  }
}

// 自动翻译所有行
async function autoTranslateAllLines() {
  const loader = document.getElementById("translationLoader");
  loader.style.display = "block";

  const rows = document.querySelectorAll("#translationBody tr");
  const lang = document.querySelector(".lang-btn.active").dataset.lang || "en";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const original = row.cells[1].textContent;
    const input = row.querySelector("input");

    // 更新状态
    loader.querySelector("p").textContent = `正在翻译第${i + 1}/${rows.length}行...`;

    try {
      const translation = await translateText(original, lang);
      input.value = translation;
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`翻译第${i + 1}行失败:`, error);
      input.value = "翻译失败";
    }
  }

  loader.style.display = "none";
  showNotification("所有行已翻译完成！");
  refreshPreview();
}

// 全部自动生成
async function generateAll() {
  generatePinyin();
  await generateTranslation();
  await autoTranslateAllLines();
  refreshPreview();
  showNotification("所有数据已自动生成！");
}

// 预览分行
function previewSplit() {
  const fullText = document.getElementById("fullPoemInput").value;
  if (!fullText.trim()) {
    showNotification("请输入诗歌内容！");
    return;
  }

  const strategy = document.getElementById("splitStrategy").value;
  let lines = [];

  switch (strategy) {
    case "comma":
      lines = fullText.split(/[，]/).filter((line) => line.trim() !== "");
      break;
    case "semicolon":
      lines = fullText.split(/[。]/).filter((line) => line.trim() !== "");
      break;
    case "custom":
      const charsPerLine = parseInt(document.getElementById("charsPerLine").value) || 5;
      lines = [];
      let temp = "";
      for (let i = 0; i < fullText.length; i++) {
        temp += fullText[i];
        if ((i + 1) % charsPerLine === 0 && i > 0) {
          lines.push(temp);
          temp = "";
        }
      }
      if (temp) lines.push(temp);
      break;
    default:
      lines = fullText.split(/[，。；！？]/).filter((line) => line.trim() !== "");
  }

  const preview = document.getElementById("splitPreview");
  preview.innerHTML = "";

  if (lines.length === 0) {
    preview.innerHTML = '<div class="split-preview-line">无法识别分行点，请尝试其他分行策略</div>';
    return;
  }

  lines.forEach((line, index) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "split-preview-line";
    lineDiv.innerHTML = `<strong>${index + 1}.</strong> ${line}`;
    preview.appendChild(lineDiv);
  });
}

// 应用分行
function applySplit() {
  const fullText = document.getElementById("fullPoemInput").value;
  if (!fullText.trim()) {
    showNotification("请输入诗歌内容！");
    return;
  }

  const strategy = document.getElementById("splitStrategy").value;
  let lines = [];

  switch (strategy) {
    case "comma":
      lines = fullText.split(/[，]/).filter((line) => line.trim() !== "");
      break;
    case "semicolon":
      lines = fullText.split(/[。]/).filter((line) => line.trim() !== "");
      break;
    case "custom":
      const charsPerLine = parseInt(document.getElementById("charsPerLine").value) || 5;
      lines = [];
      let temp = "";
      for (let i = 0; i < fullText.length; i++) {
        temp += fullText[i];
        if ((i + 1) % charsPerLine === 0 && i > 0) {
          lines.push(temp);
          temp = "";
        }
      }
      if (temp) lines.push(temp);
      break;
    default:
      lines = fullText.split(/[，。；！？]/).filter((line) => line.trim() !== "");
  }

  if (lines.length === 0) {
    showNotification("无法识别分行点，请尝试其他分行策略");
    return;
  }

  const poemLines = document.getElementById("poemLines");
  poemLines.innerHTML = "";

  lines.forEach((line, index) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "poem-line";
    lineDiv.innerHTML = `
      <div class="line-number">${index + 1}</div>
      <input type="text" class="line-input" value="${line}" data-original="${line}">
    `;
    poemLines.appendChild(lineDiv);
  });

  const tbody = document.getElementById("translationBody");
  tbody.innerHTML = "";

  lines.forEach((line, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${line}</td>
      <td><input type="text" value="" data-original=""></td>
    `;
    tbody.appendChild(row);
  });

  reparseCharacters();
  refreshPreview();
  showNotification("分行已成功应用到编辑区域！");
}

// 生成网页功能
function generateWebPage() {
    const previewContainer = document.getElementById("previewContainer");
    const lang = document.querySelector(".lang-btn.active").dataset.lang;
    
    // 创建完整的HTML结构
    let htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>诗歌展示</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .poem-line { margin-bottom: 15px; line-height: 1.6; }
        .translation { margin-top: 30px; font-style: italic; color: #555; }
        .preview-char { position: relative; display: inline-block; }
        .preview-char:hover .preview-info { display: block; }
        .preview-info { 
            display: none; 
            position: absolute; 
            bottom: 100%; 
            left: 50%; 
            transform: translateX(-50%); 
            background: #333; 
            color: white; 
            padding: 5px 10px; 
            border-radius: 4px; 
            white-space: nowrap; 
            z-index: 10;
            font-size: 0.8em;
        }
        .preview-info span { display: block; }
    </style>
</head>
<body>
    <h1>诗歌展示</h1>
    <div class="poem-content">`;

    // 添加诗歌内容
    const previewLines = document.querySelectorAll(".preview-line");
    const previewTranslations = document.querySelectorAll(".preview-translation");

    if (previewLines.length > 0) {
        // Annahme: Jede Zeile hat eine entsprechende Übersetzung am gleichen Index
        previewLines.forEach((line, index) => {
            // Gedichtzeile hinzufügen
            htmlContent += `<div class="poem-line">${line.innerHTML}</div>`;
            
            // Passende Übersetzung hinzufügen (falls vorhanden)
            if (previewTranslations[index]) {
                htmlContent += `<div class="translation">${previewTranslations[index].innerHTML}</div>`;
            }
        });
    } else {
        htmlContent += `<p>无诗歌内容</p>`;
    }

    // 添加翻译
    htmlContent += `
    </div>
    </body>
    </html>`;
    
    // 显示预览
    const webPreviewContainer = document.getElementById("webPreviewContainer");
    const webPreviewFrame = document.getElementById("webPreviewFrame");
    
    try {
      // 使用Blob URL替代直接设置srcdoc
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      webPreviewFrame.src = url;
      webPreviewContainer.style.display = "block";
      
      // 存储生成的HTML
      webPreviewContainer.dataset.htmlContent = htmlContent;
      
      showNotification("网页已生成！");
    } catch (error) {
      console.error("生成网页失败:", error);
      showNotification("生成网页失败！");
    }
  }


// 下载网页功能
function downloadWebPage() {
    const webPreviewContainer = document.getElementById("webPreviewContainer");
    const htmlContent = webPreviewContainer.dataset.htmlContent;
    
    if (!htmlContent) {
        showNotification("请先生成网页！");
        return;
    }
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poem_showcase.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification("网页已下载！");
}

// 生成PDF功能
function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            throw new Error("jsPDF库未正确加载");
        }
        
        const doc = new jsPDF();
        
        // 设置中文字体（需要先加载中文字体文件）
        // 注意：这里使用的是默认字体，可能不支持所有中文
        // 实际应用中应该加载专门的中文字体
        
        // 添加标题
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("诗歌展示", 105, 15, { align: "center" });
        
        let yPosition = 30;
        
        // 添加诗歌内容
        const previewLines = document.querySelectorAll(".preview-line");
        if (previewLines.length > 0) {
            doc.setFontSize(12);
            previewLines.forEach(line => {
                const text = line.textContent.replace(/\s+/g, " ").trim();
                if (text) {
                    doc.text(text, 15, yPosition);
                    yPosition += 10;
                }
            });
        }
        
        yPosition += 10;
        
        // 添加翻译
        const previewTranslations = document.querySelectorAll(".preview-translation");
        if (previewTranslations.length > 0) {
            doc.setFontSize(16);
            doc.text("翻译", 15, yPosition);
            yPosition += 10;
            
            doc.setFontSize(12);
            previewTranslations.forEach(trans => {
                const text = trans.textContent.replace(/\s+/g, " ").trim();
                if (text) {
                    doc.text(text, 15, yPosition);
                    yPosition += 10;
                }
            });
        }
        
        // 保存PDF
        doc.save("poem_showcase.pdf");
        showNotification("PDF已生成！");
    } catch (error) {
        console.error("生成PDF失败:", error);
        showNotification("生成PDF失败: " + error.message);
    }
}

// 初始化诗歌编辑界面
function initPoemEditor() {
  const poemLines = document.getElementById("poemLines");
  poemLines.innerHTML = "";

  poemText.forEach((line, index) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "poem-line";
    lineDiv.innerHTML = `
      <div class="line-number">${index + 1}</div>
      <input type="text" class="line-input" value="${line}" data-original="${line}">
    `;
    poemLines.appendChild(lineDiv);
  });

  const tbody = document.getElementById("translationBody");
  tbody.innerHTML = "";

  poemText.forEach((line, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${line}</td>
      <td><input type="text" value="" data-original=""></td>
    `;
    tbody.appendChild(row);
  });

  reparseCharacters();
}

// 初始化事件监听
document.addEventListener("DOMContentLoaded", () => {
  initPoemEditor();

  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      detectChanges();
      if (this.classList.contains("line-input")) {
        updateOriginalTexts();
      }
    });
  });

  // 语言切换
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      refreshPreview();
    });
  });

  // 分行策略选择
  document.getElementById("splitStrategy").addEventListener("change", function () {
    const customOption = document.getElementById("customOption");
    if (this.value === "custom") {
      customOption.style.display = "flex";
    } else {
      customOption.style.display = "none";
    }
  });

  // 按钮事件
  document.getElementById("saveCharsBtn").addEventListener("click", saveCharData);
  document.getElementById("resetBtn").addEventListener("click", resetAllChanges);
  document.getElementById("addLineBtn").addEventListener("click", addNewLine);
  document.getElementById("reparseBtn").addEventListener("click", reparseCharacters);
  document.getElementById("refreshPreviewBtn").addEventListener("click", refreshPreview);
  document.getElementById("autoPinyinBtn").addEventListener("click", generatePinyin);
  document.getElementById("autoTranslationBtn").addEventListener("click", generateTranslation);
  document.getElementById("autoAllBtn").addEventListener("click", generateAll);
  document.getElementById("autoLineBtn").addEventListener("click", () => {
    const activeRow = document.querySelector(".translation-table tbody tr.editing");
    const rows = document.querySelectorAll("#translationBody tr");
    let index = 0;

    if (activeRow) {
      index = Array.from(rows).indexOf(activeRow);
    }

    autoTranslateLine(index);
  });
  document.getElementById("translateAllBtn").addEventListener("click", autoTranslateAllLines);
  document.getElementById("previewSplitBtn").addEventListener("click", previewSplit);
  document.getElementById("applySplitBtn").addEventListener("click", applySplit);

  // 新增的导出功能
  document.getElementById("generateWebBtn").addEventListener("click", generateWebPage);
  document.getElementById("generatePdfBtn").addEventListener("click", generatePDF);
  document.getElementById("downloadWebBtn").addEventListener("click", downloadWebPage);

  detectChanges();
  refreshPreview();

  // 初始自动生成
  setTimeout(async () => {
    await generateAll();
  }, 1000);
});