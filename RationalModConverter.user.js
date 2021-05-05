// ==UserScript==
// @name         RationalModConverterUserJS
// @namespace    iilj
// @version      2021.5.5.0
// @description  RationalModConverter https://github.com/catupper/RationalModConverter/ の userjs 版です．
// @author       iilj
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://yukicoder.me/problems/*
// @grant        none
// ==/UserScript==

class RationalModConverter {
    static re = /\d+/;
    static SPAN_CLASS_NAME = 'rmc-result-span';

    /** @type {[string, number][]} */
    static str2mod = [
        ['998244353', 998244353],
        ['1000000007', 1000000007],
        ['10^{9}+7', 1000000007],
        ['10^9+7', 1000000007],
        ['109+7', 1000000007],
    ];

    constructor() {
        /** @type {HTMLElement | undefined} */
        let root = undefined;
        if (location.hostname === 'atcoder.jp') {
            root = document.getElementById('task-statement');
        } else if (location.hostname === 'yukicoder.me') {
            root = document.getElementById('content');
        }
        if (root === undefined) return;

        this.mod = this.searchMod(root);
        if (this.mod === undefined) return;
        this.dfsNodes(root);
    }

    /** @type {(root: HTMLElement) => (number | undefined)} */
    searchMod(root) {
        /** @type {number | undefined} */
        let mod = undefined;

        const scripts = root.querySelectorAll('var > script');
        for (let i = 0; i < scripts.length; i++) {
            if ((mod = this.serarchModSub(scripts[i])) !== undefined) return mod;
        }

        const mjxs = root.querySelectorAll('mjx-assistive-mml');
        for (let i = 0; i < mjxs.length; i++) {
            if ((mod = this.serarchModSub(mjxs[i])) !== undefined) return mod;
        }
        return undefined;
    }

    /** @type {(element: HTMLElement) => (number | undefined)} */
    serarchModSub(element) {
        const txt = element.textContent;
        const ret = RationalModConverter.str2mod.find(([pat, _]) => txt.indexOf(pat) !== -1);
        if (ret === undefined) return undefined;
        return ret[1];
    }

    /** @type {(root: HTMLElement, mod: number) => void} */
    dfsNodes(root) {
        if (root.classList.contains(RationalModConverter.SPAN_CLASS_NAME)) return;
        root.childNodes.forEach(childNode => {
            switch (childNode.nodeName) {
                case 'SPAN':
                case 'DIV':
                case 'P':
                case 'PRE':
                case 'UL':
                case 'OL':
                case 'LI':
                case 'SECTION':
                    this.dfsNodes(childNode);
                    break;
                case '#text':
                    this.rewriteTextNode(childNode, root);
                    break;
                default:
                    break;
            }
        });
    }

    /** @type {(node: Text, parent: HTMLElement, mod: number) => void} */
    rewriteTextNode(node, parent) {
        const match = RationalModConverter.re.exec(node.nodeValue);
        if (match !== null) {
            const len = match.index + (match[0].length);
            const nextNode = node.splitText(len);

            const parsed = parseInt(match[0]);
            if (parsed < this.mod && parsed * parsed * 2 > this.mod) {
                const w = RationalModConverter.reconstruct(parsed, this.mod);
                const newSpan = document.createElement('span');
                newSpan.innerText = (w[1] === 1) ? ` ${w[0]}` : ` ${w[0]}/${w[1]}`;
                newSpan.style.color = 'red';
                newSpan.style.marginRight = '0.5rem';
                newSpan.classList.add(RationalModConverter.SPAN_CLASS_NAME);
                parent.insertBefore(newSpan, nextNode);
                // console.log(parsed, w);
            }
            this.rewriteTextNode(nextNode, parent);
        }
    }

    /** 
     * Rational reconstruction (mathematics) - Wikipedia
     * https://en.wikipedia.org/wiki/Rational_reconstruction_(mathematics)
     * @type {(n: number, mod: number) => [number, number]}
     **/
    static reconstruct(n, mod) {
        /** @type{[number, number]} */
        let v = [mod, 0];
        /** @type{[number, number]} */
        let w = [n, 1];
        while (w[0] * w[0] * 2 > mod) {
            const q = Math.floor(v[0] / w[0]);
            const z = [v[0] - q * w[0], v[1] - q * w[1]];
            v = w;
            w = z;
        }
        if (w[1] < 0) {
            w[0] *= -1;
            w[1] *= -1;
        }
        return w;
    }
}

(() => {
    'use strict';

    window.addEventListener('load', () => {
        const r = new RationalModConverter();
    });
})();
