import { reconstruct } from './rational_reconstruction';

export class RationalModConverter {
    static re = /\d+/;
    static SPAN_CLASS_NAME = 'rmc-result-span';

    mod: number | undefined;

    static str2mod: [string, number][] = [
        ['998244353', 998244353],
        ['1000000007', 1000000007],
        ['10^{9}+7', 1000000007],
        ['10^9+7', 1000000007],
        ['109+7', 1000000007],
    ];

    constructor() {
        let root: HTMLElement | null = null;
        if (location.hostname === 'atcoder.jp') {
            root = document.getElementById('task-statement');
        } else if (location.hostname === 'yukicoder.me') {
            root = document.getElementById('content');
        }
        if (root === null) return;

        this.mod = this.searchMod(root);
        if (this.mod === undefined) return;
        this.dfsNodes(root);
    }

    searchMod(root: HTMLElement): number | undefined {
        let mod: number | undefined = undefined;

        const scripts = root.querySelectorAll<HTMLScriptElement>('var > script');
        for (let i = 0; i < scripts.length; i++) {
            if ((mod = this.serarchModSub(scripts[i])) !== undefined) return mod;
        }

        const mjxs = root.querySelectorAll<HTMLElement>('mjx-assistive-mml');
        for (let i = 0; i < mjxs.length; i++) {
            if ((mod = this.serarchModSub(mjxs[i])) !== undefined) return mod;
        }

        const katex = root.querySelectorAll<HTMLSpanElement>('span.katex-html');
        for (let i = 0; i < katex.length; i++) {
            if ((mod = this.serarchModSub(katex[i])) !== undefined) return mod;
        }
        return undefined;
    }

    serarchModSub(element: HTMLElement): number | undefined {
        const txt = element.textContent;
        if (txt === null) return undefined;
        const ret = RationalModConverter.str2mod.find(([pat]) => txt.indexOf(pat) !== -1);
        if (ret === undefined) return undefined;
        return ret[1];
    }

    dfsNodes(root: HTMLElement): void {
        if (root.classList.contains(RationalModConverter.SPAN_CLASS_NAME)) return;
        root.childNodes.forEach((childNode) => {
            switch (childNode.nodeName) {
                case 'SPAN':
                case 'DIV':
                case 'P':
                case 'PRE':
                case 'UL':
                case 'OL':
                case 'LI':
                case 'SECTION':
                    this.dfsNodes(childNode as HTMLElement);
                    break;
                case '#text':
                    this.rewriteTextNode(childNode as Text, root);
                    break;
                default:
                    break;
            }
        });
    }

    rewriteTextNode(node: Text, parent: HTMLElement): void {
        if (this.mod === undefined) return;
        if (node.nodeValue === null) return;

        const match = RationalModConverter.re.exec(node.nodeValue);
        if (match !== null) {
            const len = match.index + match[0].length;
            const nextNode = node.splitText(len);

            const parsed = parseInt(match[0]);
            if (parsed < this.mod && parsed * parsed * 2 > this.mod) {
                const w = reconstruct(parsed, this.mod);
                const newSpan = document.createElement('span');
                newSpan.innerText = w[1] === 1 ? ` ${w[0]}` : ` ${w[0]}/${w[1]}`;
                newSpan.style.color = 'red';
                newSpan.style.marginRight = '0.5rem';
                newSpan.classList.add(RationalModConverter.SPAN_CLASS_NAME);
                parent.insertBefore(newSpan, nextNode);
                // console.log(parsed, w);
            }
            this.rewriteTextNode(nextNode, parent);
        }
    }
}
