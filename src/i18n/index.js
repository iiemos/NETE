import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { moduleTranslations } from "./moduleTranslations";

const resources = {
  zh: {
    translation: {
      common: {
        language: "语言",
        chinese: "简体中文",
        traditionalChinese: "繁體中文",
        english: "English",
        japanese: "日本語",
        korean: "한국어",
        loading: "加载中...",
        unavailable: "--",
      },
      nav: {
        home: "首页",
        mining: "矿机",
        vip: "VIP",
        c2c: "C2C",
        seed: "种子 NETE",
        team: "团队",
        my: "我的",
        wallet: {
          connect: "连接钱包",
          disconnect: "断开连接",
          switchChain: "切换到目标链",
          processing: "处理中...",
          select: "选择钱包",
          connecting: "连接中...",
          noConnector: "暂无可用钱包连接方式",
          connectionFailed: "钱包连接失败",
        },
      },
      footer: {
        tagline: "连接传统支付与 Web3 的透明可持续生态。",
        closing: "NETE  连接传统支付与Web3的透明可持续生态。",
        product: "产品",
        developers: "开发者",
        company: "公司",
        mining: "矿机",
        c2cMarket: "C2C 市场",
        project: "项目介绍",
        myPanel: "我的面板",
        teamCenter: "团队中心",
        home: "首页",
        team: "团队",
        built: "",
        privacy: "",
        terms: "",
      },
      c2cFrame: {
        quick: "快捷区",
        self: "自选区",
        vip: "VIP 尊享区",
        orders: "订单",
        profile: "个人中心",
        more: "更多",
      },
      modules: moduleTranslations.zh,
      landing: {
        toast: {
          default: "NETE 操作已成功提交",
          core: "正在加载 NETE 核心模型...",
          launch: "正在进入 NETE 应用生态...",
          wallet: "正在初始化你的链上参与账户...",
        },
        hero: {
          badge: "通缩经济｜社区自治｜透明规则",
          titleA: "NETE｜连接传统支付",
          titleB: "与 Web3 的",
          titleC: "未来。",
          subtitle: "NETE 以链上通缩经济模型与矿机产出机制重塑时间价值，构建透明可持续的去中心化经济引擎。",
          primary: "查看核心模型",
          secondary: "了解机制细节",
          phone: {
            modulesTitle: "一屏直达\n核心模块",
            modulesA: "矿机 / C2C / 我的",
            modulesB: "团队 · 种子",
            account: "我的链上账户",
            totalAsset: "NETE 总资产",
            data: "今日关键数据",
            principal: "本金钱包",
            withdrawable: "可提余额",
            circulate: "流通钱包",
            team: "团队业绩",
            c2c: "C2C 自选区",
            realtime: "REALTIME",
            merchants: "实时优选\n委托商家",
            quickPrice: "快捷区价格",
            bestMatch: "最优撮合",
            sellerFee: "卖方手续费",
            transparent: "链上透明",
            quick: "快捷区",
            self: "自选区",
            orders: "订单",
            vipBoost: "业绩权益",
            max: "最高 45%",
            miningIncome: "矿机收益",
            daily: "每日结算",
          },
        },
        features: {
          eyebrow: "// Onchain Mechanisms",
          title: "自动即信任\n链上核心机制",
          desc: "以智能合约自动执行矿机质押挖矿、社区激励与安全透明机制，让产出、分配和流通规则全链上可查。",
          cards: [
            { title: "质押挖矿・复利增长", desc: "多档位矿机灵活参与，每日自动产息，本金复投、利润可提，周期自动延长减产防通胀。", tag: "多档矿机｜每日产息｜周期减产" },
            { title: "多级激励・共治共享", desc: "直推 8 人享 20 层加速，V1-V9 等级分红，手续费全链上分配，C2C 支持做市商。", tag: "20 层加速｜V1-V9 分红" },
            { title: "链上可信・规则透明", desc: "合约自动执行，无中央资金池，全数据上链可查。", tag: "智能合约｜无资金池｜数据可查" }
          ],
        },
        project: {
          eyebrow: "// Deflation Model",
          title: "稀缺即价值，通缩经济模型",
          desc: "NETE 以 30 亿枚初始总量启动，通过提币及激活矿机触发直接销毁，最终通缩目标为 2100 万枚。",
          mechanismsTitle: "发行与通缩",
          rulesTitle: "初始分配",
          modelMechanisms: [
            "初始总量：30 亿枚 NETE。",
            "终极通缩：2100 万枚。",
            "通缩触发：提币及激活矿机直接销毁。",
            "链上通缩经济模型持续压缩流通供给。"
          ],
          roadmapItems: [
            "种子轮：500 万枚，单价 0.5 USDT。",
            "空投：500 万枚。",
            "矿机产出释放：约 29.9 亿枚。",
            "空投与矿机产出共同构成生态启动入口。"
          ],
          contractItems: [
            { name: "空投转化", detail: "注册送 100 型空投矿机，75 天内购买不低于 100 型真实矿机后，空投矿机可转为永久。" }
          ],
        },
        announcements: {
          aria: "NETE 公告栏",
          label: "公告",
        },
        team: {
          eyebrow: "// Technical Team",
          title: "技术团队・可信执行",
          desc: "EEA 联盟成员，自主研发 VIA Protocol 与 Nete 平台，拥有全栈区块链技术能力。",
          items: [
            { title: "自主研发", desc: "核心协议、业务合约与前端交互统一围绕链上透明规则构建。", tag: "VIA Protocol｜Nete 平台" },
            { title: "安全可信", desc: "以合约自动执行为基础，持续提升生态参与、结算与数据同步的可靠性。", tag: "全栈技术｜链上验证" }
          ],
        },
        markets: {
          eyebrow: "// Token Economy",
          title: "发行、分配与\n空投转化",
          cards: [
            { name: "初始总量", ticker: "SUPPLY", price: "30 亿 NETE", change: "生态启动总供给" },
            { name: "终极通缩", ticker: "DEFLATION", price: "2100 万 NETE", change: "提币及激活矿机触发销毁" },
            { name: "种子轮", ticker: "SEED", price: "500 万 NETE", change: "0.5 USDT / NETE" },
            { name: "空投", ticker: "AIRDROP", price: "500 万 NETE", change: "注册送 100 型空投矿机" },
            { name: "矿机产出释放", ticker: "MINING", price: "约 29.9 亿 NETE", change: "按链上规则逐步释放" }
          ],
        },
        cta: {
          title: "加入 NETE｜共建透明、可持续的链上价值生态",
          subtitle: "从通缩经济、矿机产出到社区自治，NETE 以透明规则连接传统支付与 Web3 的未来。",
          action: "立即参与 NETE",
          enter: "立即进入",
          quick: "快速前往",
          mining: "矿机模块",
          c2c: "C2C 市场",
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        language: "Language",
        chinese: "简体中文",
        traditionalChinese: "繁體中文",
        english: "English",
        japanese: "日本語",
        korean: "한국어",
        loading: "Loading...",
        unavailable: "--",
      },
      nav: {
        home: "Home",
        mining: "Mining",
        vip: "VIP",
        c2c: "C2C",
        seed: "Seed NETE",
        team: "Team",
        my: "My",
        wallet: {
          connect: "Connect Wallet",
          disconnect: "Disconnect",
          switchChain: "Switch Chain",
          processing: "Processing...",
          select: "Select Wallet",
          connecting: "Connecting...",
          noConnector: "No wallet connector available",
          connectionFailed: "Wallet connection failed",
        },
      },
      footer: {
        tagline: "Connecting traditional payments and Web3 through a transparent, sustainable ecosystem.",
        closing: "NETE connects traditional payments with a transparent, sustainable Web3 ecosystem.",
        product: "Product",
        developers: "Developers",
        company: "Company",
        mining: "Mining",
        c2cMarket: "C2C Market",
        project: "Project Overview",
        myPanel: "My Dashboard",
        teamCenter: "Team Center",
        home: "Home",
        team: "Team",
        built: "Built with ♥ on Ethereum",
        privacy: "Privacy",
        terms: "Terms",
      },
      c2cFrame: {
        quick: "Quick Zone",
        self: "Market Zone",
        vip: "VIP Zone",
        orders: "Orders",
        profile: "Profile",
        more: "More",
      },
      modules: moduleTranslations.en,
      landing: {
        toast: {
          default: "NETE action submitted",
          core: "Loading the NETE core model...",
          launch: "Entering the NETE ecosystem...",
          wallet: "Initializing your on-chain account...",
        },
        hero: {
          badge: "Deflationary Economy | Community Autonomy | Transparent Rules",
          titleA: "NETE | Connecting Traditional",
          titleB: "Payments with the",
          titleC: "Future of Web3.",
          subtitle: "NETE reshapes time value through an on-chain deflationary economy and miner output mechanism, building a transparent, sustainable decentralized economic engine.",
          primary: "View Core Model",
          secondary: "Explore Mechanics",
          phone: {
            modulesTitle: "Core modules\nin one screen",
            modulesA: "Mining / C2C / My",
            modulesB: "Team · Seed",
            account: "My On-chain Account",
            totalAsset: "Total NETE Assets",
            data: "Key Data Today",
            principal: "Principal Wallet",
            withdrawable: "Withdrawable",
            circulate: "Circulating Wallet",
            team: "Team Volume",
            c2c: "C2C Market Zone",
            realtime: "REALTIME",
            merchants: "Live curated\nmerchant orders",
            quickPrice: "Quick Price",
            bestMatch: "Best Match",
            sellerFee: "Seller Fee",
            transparent: "On-chain",
            quick: "Quick",
            self: "Market",
            orders: "Orders",
            vipBoost: "Performance",
            max: "Up to 45%",
            miningIncome: "Mining Yield",
            daily: "Daily Settlement",
          },
        },
        features: {
          eyebrow: "// Onchain Mechanisms",
          title: "Automation Builds Trust\nCore On-chain Mechanisms",
          desc: "Smart contracts automate miner staking, community incentives, and transparent safety rules, making output, distribution, and circulation fully traceable on-chain.",
          cards: [
            { title: "Staking Mining, Compound Growth", desc: "Multiple miner tiers offer flexible participation, daily automated yield, principal reinvestment, withdrawable profit, and cycle extensions with output reduction to prevent inflation.", tag: "Multi-tier miners | Daily yield | Cycle reduction" },
            { title: "Multi-level Incentives, Shared Governance", desc: "Users with 8 direct referrals unlock 20-level acceleration, V1-V9 level dividends, fully on-chain fee distribution, and C2C market-maker support.", tag: "20-level acceleration | V1-V9 dividends" },
            { title: "On-chain Trust, Transparent Rules", desc: "Contracts execute automatically with no central fund pool, and all data is verifiable on-chain.", tag: "Smart contracts | No fund pool | Verifiable data" }
          ],
        },
        project: {
          eyebrow: "// Deflation Model",
          title: "Scarcity Creates Value, A Deflationary Economy",
          desc: "NETE starts with an initial supply of 3 billion tokens. Withdrawals and miner activation trigger direct burns, with an ultimate deflation target of 21 million tokens.",
          mechanismsTitle: "Issuance and Deflation",
          rulesTitle: "Initial Allocation",
          modelMechanisms: [
            "Initial supply: 3 billion NETE.",
            "Ultimate deflation target: 21 million tokens.",
            "Burn trigger: withdrawals and miner activation directly destroy tokens.",
            "The on-chain deflationary economy continuously compresses circulating supply."
          ],
          roadmapItems: [
            "Seed round: 5 million tokens at 0.5 USDT each.",
            "Airdrop: 5 million tokens.",
            "Miner output release: about 2.99 billion tokens.",
            "Airdrops and miner output together form the ecosystem launch entry."
          ],
          contractItems: [
            { name: "Airdrop Conversion", detail: "Registration grants a 100-type airdrop miner. If the user buys a real miner of at least 100 type within 75 days, the airdrop miner can become permanent." }
          ],
        },
        announcements: {
          aria: "NETE announcements",
          label: "Notice",
        },
        team: {
          eyebrow: "// Technical Team",
          title: "Technical Team, Trusted Execution",
          desc: "As an EEA alliance member, the team independently develops VIA Protocol and the Nete platform with full-stack blockchain capabilities.",
          items: [
            { title: "Independent R&D", desc: "Core protocol, business contracts, and frontend flows are built around transparent on-chain rules.", tag: "VIA Protocol | Nete Platform" },
            { title: "Secure and Reliable", desc: "Contract automation improves reliability across participation, settlement, and data synchronization.", tag: "Full-stack tech | On-chain verification" }
          ],
        },
        markets: {
          eyebrow: "// Token Economy",
          title: "Issuance, Allocation\nand Airdrop Conversion",
          cards: [
            { name: "Initial Supply", ticker: "SUPPLY", price: "3B NETE", change: "Total ecosystem launch supply" },
            { name: "Ultimate Deflation", ticker: "DEFLATION", price: "21M NETE", change: "Burns triggered by withdrawals and miner activation" },
            { name: "Seed Round", ticker: "SEED", price: "5M NETE", change: "0.5 USDT / NETE" },
            { name: "Airdrop", ticker: "AIRDROP", price: "5M NETE", change: "Register to receive a 100-type airdrop miner" },
            { name: "Miner Output Release", ticker: "MINING", price: "About 2.99B NETE", change: "Released gradually by on-chain rules" }
          ],
        },
        cta: {
          title: "Join NETE | Build a transparent, sustainable on-chain value ecosystem together",
          subtitle: "From a deflationary economy and miner output to community autonomy, NETE uses transparent rules to connect traditional payments with the future of Web3.",
          action: "Join NETE Now",
          enter: "Enter",
          quick: "Open",
          mining: "Mining Module",
          c2c: "C2C Market",
        },
      },
    },
  },
};

export const languageOptions = [
  { key: "zh", labelKey: "common.chinese" },
  { key: "zh-TW", labelKey: "common.traditionalChinese" },
  { key: "en", labelKey: "common.english" },
  { key: "ja", labelKey: "common.japanese" },
  { key: "ko", labelKey: "common.korean" },
];

function mergeTranslations(base, overrides) {
  if (Array.isArray(base) || Array.isArray(overrides)) return overrides ?? base;
  if (!base || typeof base !== "object") return overrides ?? base;

  const result = { ...base };
  for (const [key, value] of Object.entries(overrides || {})) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? mergeTranslations(base[key], value)
      : value;
  }
  return result;
}

resources["zh-TW"] = {
  translation: mergeTranslations(resources.zh.translation, {
    common: {
      language: "語言",
      loading: "載入中...",
    },
    nav: {
      home: "首頁",
      mining: "礦機",
      seed: "種子 NETE",
      team: "團隊",
      my: "我的",
      wallet: {
        connect: "連接錢包",
        disconnect: "斷開連接",
        switchChain: "切換到目標鏈",
        processing: "處理中...",
        select: "選擇錢包",
        connecting: "連接中...",
        noConnector: "暫無可用錢包連接方式",
        connectionFailed: "錢包連接失敗",
      },
    },
    footer: {
      tagline: "連接傳統支付與 Web3 的透明可持續生態。",
      closing: "NETE  連接傳統支付與Web3的透明可持續生態。",
    },
    modules: moduleTranslations["zh-TW"],
    landing: {
      hero: {
        badge: "通縮經濟｜社區自治｜透明規則",
        titleA: "NETE｜連接傳統支付",
        titleB: "與 Web3 的",
        titleC: "未來。",
        subtitle: "NETE 以鏈上通縮經濟模型與礦機產出機制重塑時間價值，構建透明可持續的去中心化經濟引擎。",
        primary: "查看核心模型",
        secondary: "了解機制細節",
      },
      features: {
        title: "自動即信任\n鏈上核心機制",
        desc: "以智能合約自動執行礦機質押挖礦、社區激勵與安全透明機制。",
        cards: [
          { title: "質押挖礦・複利增長", desc: "多檔位礦機靈活參與，每日自動產息，本金復投、利潤可提。", tag: "多檔礦機｜每日產息｜週期減產" },
          { title: "多級激勵・共治共享", desc: "直推 8 人享 20 層加速，V1-V9 等級分紅，手續費全鏈上分配。", tag: "20 層加速｜V1-V9 分紅" },
          { title: "鏈上可信・規則透明", desc: "合約自動執行，無中央資金池，全數據鏈上可查。", tag: "智能合約｜無資金池｜數據可查" },
        ],
      },
      project: {
        title: "稀缺即價值，通縮經濟模型",
        desc: "NETE 以 30 億枚初始總量啟動，通過提幣及激活礦機觸發直接銷毀，最終通縮目標為 2100 萬枚。",
        mechanismsTitle: "發行與通縮",
        rulesTitle: "初始分配",
        modelMechanisms: ["初始總量：30 億枚 NETE。", "終極通縮：2100 萬枚。", "通縮觸發：提幣及激活礦機直接銷毀。", "鏈上通縮經濟模型持續壓縮流通供給。"],
        roadmapItems: ["種子輪：500 萬枚，單價 0.5 USDT。", "空投：500 萬枚。", "礦機產出釋放：約 29.9 億枚。", "空投與礦機產出共同構成生態啟動入口。"],
        contractItems: [{ name: "空投轉化", detail: "注册送 100 型空投礦機，75 天內購買不低於 100 型真實礦機後，空投礦機可轉為永久。" }],
      },
      announcements: {
        aria: "NETE 公告欄",
        label: "公告",
      },
      team: {
        title: "技術團隊・可信執行",
        desc: "EEA 聯盟成員，自主研發 VIA Protocol 與 Nete 平台，擁有全棧區塊鏈技術能力。",
        items: [
          { title: "自主研發", desc: "核心協議、業務合約與前端交互統一圍繞鏈上透明規則構建。", tag: "VIA Protocol｜Nete 平台" },
          { title: "安全可信", desc: "以合約自動執行為基礎，提升參與、結算與數據同步可靠性。", tag: "全棧技術｜鏈上驗證" },
        ],
      },
      cta: {
        title: "加入 NETE｜共建透明、可持續的鏈上價值生態",
        subtitle: "從通縮經濟、礦機產出到社區自治，NETE 以透明規則連接傳統支付與 Web3 的未來。",
      },
    },
  }),
};

resources.ja = {
  translation: mergeTranslations(resources.en.translation, {
    common: {
      language: "言語",
      loading: "読み込み中...",
    },
    nav: {
      home: "ホーム",
      mining: "マイニング",
      seed: "シードNETE",
      team: "チーム",
      my: "マイ",
      wallet: {
        connect: "ウォレット接続",
        disconnect: "切断",
        switchChain: "チェーン切替",
        processing: "処理中...",
        select: "ウォレット選択",
        connecting: "接続中...",
        noConnector: "利用可能なウォレット接続がありません",
        connectionFailed: "ウォレット接続に失敗しました",
      },
    },
    footer: {
      tagline: "従来型決済とWeb3をつなぐ透明で持続可能なエコシステム。",
      closing: "NETE は従来型決済とWeb3をつなぐ透明で持続可能なエコシステムです。",
    },
    modules: moduleTranslations.ja,
    landing: {
      hero: {
        badge: "デフレ経済｜コミュニティ自治｜透明なルール",
        titleA: "NETE｜従来型決済と",
        titleB: "Web3の未来を",
        titleC: "つなぐ。",
        subtitle: "NETEはオンチェーンのデフレ経済モデルとマイナー産出メカニズムで時間価値を再構築します。",
        primary: "コアモデルを見る",
        secondary: "仕組みを見る",
      },
      features: {
        eyebrow: "// オンチェーンメカニズム",
        title: "自動化が信頼を生む\nオンチェーン中核機構",
        desc: "スマートコントラクトがマイニング、コミュニティ報酬、透明な安全ルールを自動実行します。",
        cards: [
          { title: "ステーキングマイニング", desc: "複数ランクのマイナー、日次収益、元本再投資、利益引き出しに対応。", tag: "多段階｜日次収益｜周期調整" },
          { title: "多層インセンティブ", desc: "20層加速、V1-V9配当、オンチェーン手数料分配をサポート。", tag: "20層加速｜Vレベル報酬" },
          { title: "透明なオンチェーンルール", desc: "コントラクトが自動実行し、主要データはオンチェーンで検証できます。", tag: "スマートコントラクト｜検証可能" },
        ],
      },
      project: {
        title: "希少性が価値を生むデフレ経済",
        desc: "NETEは30億枚の初期供給から始まり、引き出しとマイナー有効化でバーンが発生します。",
        mechanismsTitle: "発行とデフレ",
        rulesTitle: "初期配分",
        modelMechanisms: ["初期供給：30億 NETE。", "最終デフレ目標：2100万枚。", "バーン条件：引き出しとマイナー有効化。", "オンチェーンモデルが流通供給を継続的に圧縮。"],
        roadmapItems: ["シード：500万枚、0.5 USDT。", "エアドロップ：500万枚。", "マイナー産出：約29.9億枚。", "エアドロップとマイナー産出が初期参加入口を形成。"],
        contractItems: [{ name: "エアドロップ転換", detail: "登録で100型エアドロップマイナーを受け取り、条件達成後に永久化できます。" }],
      },
      announcements: {
        aria: "NETE お知らせ",
        label: "お知らせ",
      },
      team: {
        eyebrow: "// 技術チーム",
        title: "技術チームと信頼できる実行",
        desc: "EEAメンバーとして、VIA ProtocolとNeteプラットフォームを独自開発しています。",
        items: [
          { title: "独自開発", desc: "プロトコル、業務コントラクト、UIを透明なオンチェーンルールに沿って構築。", tag: "VIA Protocol｜Nete" },
          { title: "安全で信頼性の高い運用", desc: "自動実行により参加、精算、データ同期の信頼性を高めます。", tag: "フルスタック｜オンチェーン検証" },
        ],
      },
      cta: {
        title: "NETEに参加し、透明で持続可能なオンチェーン価値を共に構築",
        subtitle: "NETEは透明なルールで従来型決済とWeb3の未来をつなぎます。",
      },
    },
  }),
};

resources.ko = {
  translation: mergeTranslations(resources.en.translation, {
    common: {
      language: "언어",
      loading: "로딩 중...",
    },
    nav: {
      home: "홈",
      mining: "마이닝",
      seed: "시드 NETE",
      team: "팀",
      my: "내 계정",
      wallet: {
        connect: "지갑 연결",
        disconnect: "연결 해제",
        switchChain: "체인 전환",
        processing: "처리 중...",
        select: "지갑 선택",
        connecting: "연결 중...",
        noConnector: "사용 가능한 지갑 연결이 없습니다",
        connectionFailed: "지갑 연결 실패",
      },
    },
    footer: {
      tagline: "전통 결제와 Web3를 연결하는 투명하고 지속 가능한 생태계.",
      closing: "NETE는 전통 결제와 Web3를 연결하는 투명하고 지속 가능한 생태계입니다.",
    },
    modules: moduleTranslations.ko,
    landing: {
      hero: {
        badge: "디플레이션 경제｜커뮤니티 자치｜투명한 규칙",
        titleA: "NETE｜전통 결제와",
        titleB: "Web3의 미래를",
        titleC: "연결합니다.",
        subtitle: "NETE는 온체인 디플레이션 경제 모델과 마이너 산출 메커니즘으로 시간 가치를 재구성합니다.",
        primary: "핵심 모델 보기",
        secondary: "메커니즘 보기",
      },
      features: {
        eyebrow: "// 온체인 메커니즘",
        title: "자동화가 신뢰를 만듭니다\n온체인 핵심 메커니즘",
        desc: "스마트 컨트랙트가 마이닝, 커뮤니티 인센티브, 투명한 보안 규칙을 자동 실행합니다.",
        cards: [
          { title: "스테이킹 마이닝", desc: "다양한 마이너, 일일 수익, 원금 재투자, 수익 인출을 지원합니다.", tag: "다단계｜일일 수익｜주기 조정" },
          { title: "다층 인센티브", desc: "20단계 가속, V1-V9 배당, 온체인 수수료 분배를 지원합니다.", tag: "20단계 가속｜V레벨 보상" },
          { title: "투명한 온체인 규칙", desc: "컨트랙트가 자동 실행되며 핵심 데이터는 온체인에서 검증됩니다.", tag: "스마트 컨트랙트｜검증 가능" },
        ],
      },
      project: {
        title: "희소성이 가치를 만드는 디플레이션 경제",
        desc: "NETE는 30억 개 초기 공급으로 시작하며 인출과 마이너 활성화 시 소각이 발생합니다.",
        mechanismsTitle: "발행과 디플레이션",
        rulesTitle: "초기 배분",
        modelMechanisms: ["초기 공급량: 30억 NETE.", "최종 디플레이션 목표: 2100만 개.", "소각 조건: 인출 및 마이너 활성화.", "온체인 모델이 유통 공급을 지속적으로 압축합니다."],
        roadmapItems: ["시드 라운드: 500만 개, 0.5 USDT.", "에어드롭: 500만 개.", "마이너 산출: 약 29.9억 개.", "에어드롭과 마이너 산출이 초기 참여 입구를 구성합니다."],
        contractItems: [{ name: "에어드롭 전환", detail: "가입 시 100형 에어드롭 마이너를 받고 조건 충족 후 영구 마이너로 전환할 수 있습니다." }],
      },
      announcements: {
        aria: "NETE 공지",
        label: "공지",
      },
      team: {
        eyebrow: "// 기술 팀",
        title: "기술 팀과 신뢰 가능한 실행",
        desc: "EEA 멤버로서 VIA Protocol과 Nete 플랫폼을 자체 개발합니다.",
        items: [
          { title: "자체 개발", desc: "프로토콜, 비즈니스 컨트랙트, UI를 투명한 온체인 규칙 중심으로 구축합니다.", tag: "VIA Protocol｜Nete" },
          { title: "안전하고 신뢰 가능", desc: "자동 실행을 기반으로 참여, 정산, 데이터 동기화의 신뢰성을 높입니다.", tag: "풀스택｜온체인 검증" },
        ],
      },
      cta: {
        title: "NETE와 함께 투명하고 지속 가능한 온체인 가치를 구축하세요",
        subtitle: "NETE는 투명한 규칙으로 전통 결제와 Web3의 미래를 연결합니다.",
      },
    },
  }),
};

function normalizeLanguage(language) {
  const value = String(language || "").toLowerCase();
  if (value.startsWith("zh-tw") || value.startsWith("zh-hk") || value.includes("hant")) return "zh-TW";
  if (value.startsWith("en")) return "en";
  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("ko")) return "ko";
  return "zh";
}

const savedLanguage = typeof window !== "undefined" ? window.localStorage.getItem("nete-lang") : null;
const browserLanguage = typeof window !== "undefined" ? window.navigator.language : "zh";
const initialLanguage = normalizeLanguage(savedLanguage || browserLanguage);

function syncDocumentLanguage(language) {
  if (typeof document !== "undefined") {
    const nextLanguage = normalizeLanguage(language);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : nextLanguage;
  }
}

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "zh",
  supportedLngs: languageOptions.map((item) => item.key),
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  syncDocumentLanguage(language);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("nete-lang", normalizeLanguage(language));
  }
});

syncDocumentLanguage(initialLanguage);

export default i18n;
