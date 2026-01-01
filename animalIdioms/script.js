// ======= 《动物成语互动图卡》脚本 =======

// 成语数据库（示例：部分核心动物成语，可继续扩展）
const idioms = [
  { name: "狼心狗肺", meaning: "心肠狠毒，忘恩负义。" },
  { name: "画龙点睛", meaning: "在关键之处加上一笔，使内容更生动传神。" },
  { name: "狐假虎威", meaning: "借助强者的势力来欺压他人。" },
  { name: "如鱼得水", meaning: "比喻得到非常适合自己的人或环境。" },
  { name: "鸡鸣狗盗", meaning: "比喻微不足道的技艺，也指小偷小摸之徒。" },
  { name: "一箭双雕", meaning: "一举两得，用一个行动达到两个目的。" },
  { name: "杯弓蛇影", meaning: "因疑心而自惊自扰。" },
  { name: "狼吞虎咽", meaning: "形容吃东西又急又猛，好像狼虎一样。" },
  { name: "羊入虎口", meaning: "比喻弱者进入险境，危在旦夕。" },
  { name: "鱼目混珠", meaning: "拿假的冒充真的，以次充好。" },
  { name: "鸾凤和鸣", meaning: "比喻夫妻和美，生活幸福。" },
  { name: "龙争虎斗", meaning: "形容势均力敌的激烈争斗。" },
  { name: "狗急跳墙", meaning: "比喻走投无路时采取极端行动。" },
  { name: "守株待兔", meaning: "比喻死守旧法，不知变通。" },
  { name: "鹤立鸡群", meaning: "比喻人的仪态或才能出众，超群拔萃。" },
  { name: "狡兔三窟", meaning: "比喻多留退路以求安全。" },
  { name: "鸟语花香", meaning: "形容春日景色优美。" },
  { name: "狼狈为奸", meaning: "比喻互相勾结干坏事。" },
  { name: "虎头蛇尾", meaning: "有始无终，开始声势大，后劲不足。" },
  { name: "兔死狐悲", meaning: "对同类的死亡感到悲伤或担忧。" },
  { name: "蛛丝马迹", meaning: "比喻事情留下可供推测的线索。" },
  { name: "呆若木鸡", meaning: "形容因惊讶或恐惧而呆立不动。" },
  { name: "骑虎难下", meaning: "比喻事情中途难以停下，只能硬着头皮继续。" },
  { name: "龙马精神", meaning: "精神饱满、充满活力的样子。" },
  { name: "千军万马", meaning: "形容雄壮的军容或庞大的队伍。" },
  { name: "禽兽不如", meaning: "形容人品道德败坏已不如畜类。" },
  { name: "鱼贯而入", meaning: "行动有序地接连进入。" },
  { name: "龙潭虎穴", meaning: "十分危险的地方。" },
  { name: "马不停蹄", meaning: "形容一刻也不停止地前进或工作。" },
  { name: "鹬蚌相争", meaning: "比喻双方相争，第三者得利。" },
  { name: "卧虎藏龙", meaning: "比喻隐藏着未被发现的人才。" },
  { name: "飞鹰走狗", meaning: "旧时形容追随权贵、为虎作伥的行为。" },
  { name: "蛇蝎心肠", meaning: "比喻心地狠毒。" },
  { name: "狮子搏兔", meaning: "比喻做事即使对弱者也全力以赴。" },
  { name: "惊弓之鸟", meaning: "受过惊吓而遇事惶恐的人。" },
  { name: "羊肠小道", meaning: "比喻狭窄曲折的小路。" },
  { name: "九牛一毛", meaning: "比喻极大数量中极微小的一部分。" },
  { name: "蝇营狗苟", meaning: "比喻卑鄙无耻的行为或生活方式。" },
  { name: "龙生九子", meaning: "源自神话，常指同类中有各种不同类型。" },
  { name: "虎踞龙盘", meaning: "比喻形势险要的地势或地方。"}
  // ……可以继续扩展你给出的所有成语
];

// ======= 交互与分页逻辑 =======

const pageSize = 20; // 每页显示成语数量
let currentPage = 1;
const totalPages = Math.ceil(idioms.length / pageSize);

function renderPage() {
  const container = document.getElementById("idiomContainer");
  container.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, idioms.length);

  idioms.slice(start, end).forEach(i => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = i.name;
    card.onclick = () => openModal(i);
    container.appendChild(card);
  });

  document.getElementById("pageInfo").textContent = `${currentPage} / ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function openModal(idiom) {
  document.getElementById("modalTitle").textContent = idiom.name;
  document.getElementById("modalMeaning").textContent = idiom.meaning;
  document.getElementById("idiomModal").classList.add("active");
}

document.getElementById("closeBtn").onclick = () =>
  document.getElementById("idiomModal").classList.remove("active");

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) { currentPage--; renderPage(); }
};

document.getElementById("nextBtn").onclick = () => {
  if (currentPage < totalPages) { currentPage++; renderPage(); }
};

renderPage();