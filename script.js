const randomTexts = [
    "I am [cyber]Rinevard[/cyber]!",
    "[cyber]Hello, world![/cyber]",
    "I love [cyber]mathematics[/cyber]!",
    "I love [cyber]coding[/cyber]!",
    "I love [cyber]game design[/cyber]!",
    "Welcome to my [cyber]personal website[/cyber]!",
];

// TODO normal似乎没有用
const colorSchemes = [
    // 方案 1: 蓝色主题
    {
        normal: '#333333',  // 深灰色（接近黑色）用于普通文本
        cyber: ['#0000FF', '#1E90FF', '#4169E1', '#0000CD', '#00BFFF']
        // 不同深浅的蓝色：蓝色、道奇蓝、皇家蓝、中蓝色、深天蓝
    },
    // 方案 2: 绿色主题
    {
        normal: '#2C3E50',  // 深青灰色用于普通文本
        cyber: ['#2ECC71', '#27AE60', '#16A085', '#1ABC9C', '#3498DB']
        // 不同深浅的绿色：翠绿色、绿宝石、浅海洋绿、绿松石、蓝绿色
    },
    // 方案 3: 橙色主题
    {
        normal: '#34495E',  // 深蓝灰色用于普通文本
        cyber: ['#E67E22', '#D35400', '#F39C12', '#FF8C00', '#FFA500']
        // 胡萝卜橙、南瓜橙、黄橙色、深橙色、橙色
    },
    // 方案 4: 红色主题
    {
        normal: '#2C3E50',  // 深青灰色用于普通文本
        cyber: ['#E74C3C', '#C0392B', '#CD5C5C', '#FF6347', '#FF4500']
        // 不同深浅的红色：砖红、深红、印度红、番茄色、橙红色
    },
    // 方案 5: 紫色主题
    {
        normal: '#2C3E50',  // 深青灰色用于普通文本
        cyber: ['#8E44AD', '#9B59B6', '#BA55D3', '#9932CC', '#800080']
        // 深紫色、中紫色、中兰花紫、暗兰花紫、紫色
    }
];

const generateTextBtn = document.getElementById('generateTextBtn');
const randomTextContainer = document.getElementById('randomTextContainer');

let currentMixedText = null;

generateTextBtn.addEventListener('click', () => {
    if (currentMixedText) {
        currentMixedText.clear();
    }

    const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    const randomColorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

    currentMixedText = new MixedText({
        text: randomText,
        targetElement: randomTextContainer,
        fontSize: '24px',
        color: randomColorScheme.normal,
        charDelay: 50,
        cyberColors: randomColorScheme.cyber,
        containerClass: 'mixed-text-container'
    });

    currentMixedText.start();
});