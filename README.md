RationalModConverterUserJS
=====

## 概要

AtCoder/yukicoder の Mod をとる問題の問題文・サンプルに含まれる大きな値を，有理数に変換して横に表示します．

[catupper/RationalModConverter](https://github.com/catupper/RationalModConverter) の userscript 版です．機能的にはほぼ同一ですが，中身はほぼ別モノです．

![Sample Image](images/20210505-00.png "Sample")


## 機能

- 機能はほぼ本家の [catupper/RationalModConverter](https://github.com/catupper/RationalModConverter) に準じます．
- ただし，以下の点で異なります．
  - AtCoder と yukicoder 上で動作します．
  - できるだけ DOM を破壊しないように書き換え操作を行います．
    - 本家の場合，画像タグ内の属性値を破壊的に変更してしまう場合がありましたが，これを回避します
    - 本家の場合，MathJax 処理中の Element に対して innerHTML を上書きする挙動のため，MathJax に干渉してしまいますが，これを回避します．


## Greasy Fork 配布ページ

- [RationalModConverterUserJS](https://greasyfork.org/ja/scripts/425982-rationalmodconverteruserjs)


## 使用方法

Tampermonkey 等で読み込んで使用してください．


## 更新履歴

- 2021.5.5.0
  - 初版
