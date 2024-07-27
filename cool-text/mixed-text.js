// mixed-text.js
class MixedText {
    constructor(config) {
        this.text = config.text;
        this.targetElement = config.targetElement || document.body;
        this.fontSize = config.fontSize || '24px';
        this.color = config.color || '#333333';
        this.charDelay = config.charDelay || 50;
        this.cyberColors = config.cyberColors || ['#ff00ff', '#00ffff', '#ffff00'];
        this.currentIndex = 0;
        this.isGenerating = false;
        this.isCyber = false;
        this.containerClass = config.containerClass || 'mixed-text-container';
        this.targetElement.classList.add(this.containerClass);
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .${this.containerClass} {
                max-width: 800px;
                text-align: left;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                line-height: 1.5;
            }
            .${this.containerClass} .char {
                display: inline-block;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .${this.containerClass} .cyber {
                animation: cyberWave 1.5s ease-in-out infinite;
                text-shadow: 0 0 5px currentColor;
            }
            @keyframes cyberWave {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    addChar() {
        if (this.currentIndex >= this.text.length || !this.isGenerating) return;

        const char = this.text[this.currentIndex];
        if (char === '[' && this.text.substr(this.currentIndex, 7) === '[cyber]') {
            this.isCyber = true;
            this.currentIndex += 7;
            this.addChar();
            return;
        } else if (char === '[' && this.text.substr(this.currentIndex, 8) === '[/cyber]') {
            this.isCyber = false;
            this.currentIndex += 8;
            this.addChar();
            return;
        }

        const span = this.createCharSpan(char);
        this.targetElement.appendChild(span);
        this.animateChar(span);

        this.currentIndex++;

        setTimeout(() => this.addChar(), this.charDelay);
    }

    createCharSpan(char) {
        const span = document.createElement('span');
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }
        span.className = 'char';
        span.style.fontSize = this.fontSize;

        if (this.isCyber) {
            span.classList.add('cyber');
            span.style.color = this.getRandomCyberColor();
        } else {
            span.style.color = this.color;
        }

        return span;
    }

    animateChar(span) {
        requestAnimationFrame(() => {
            span.style.opacity = '0';
            requestAnimationFrame(() => {
                span.style.opacity = '1';
            });
        });
    }

    getRandomCyberColor() {
        return this.cyberColors[Math.floor(Math.random() * this.cyberColors.length)];
    }

    start() {
        this.isGenerating = true;
        this.addChar();
    }

    stop() {
        this.isGenerating = false;
    }

    clear() {
        while (this.targetElement.firstChild) {
            this.targetElement.removeChild(this.targetElement.firstChild);
        }
        this.currentIndex = 0;
    }
}