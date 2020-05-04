# MutableUrl

## 概要

Web API の [URL インターフェイス](https://developer.mozilla.org/ja/docs/Web/API/URL) をベースとした URL 操作を行うライブラリ。
内部で `URL` や `URLSearchParams` を一切使用していないため IE11 で使うことが可能。

```javascript
const url = new MutableUrl("/path/sub?a=foo");

url.setOrigin("https://example.com:1111");
// https://example.com:1111/path/sub?a=foo

url.setHash("hash");
// https://example.com:1111/path/sub?a=foo#hash

console.log(url.searchObject);
// {a: "foo"}

url.mergeSearch({b: "bar"});
// https://example.com:1111/path/sub?a=foo&b=bar#hash

const paths = url.pathArray;
// ["path", "sub"]

paths[0] = "api";
// ["api", "sub"]

url.setPathname(paths);
// https://example.com:1111/api/sub?a=foo&b=bar#hash

console.log(url.format("http://{hostname}{pathname}?{search}"));
// http://example.com/api/sub?a=foo&b=bar
```

## Constructor

### 文字列

URL 文字列を引数に指定して初期化が可能。  
フルパスだけでなく `pathname` のみ、 `search` のみでも初期化が可能。

```javascript
new MutableUrl("https://example.com/path?a=foo#hash");
new MutableUrl("/path?a=foo#hash");
new MutableUrl("a=foo#hash");
```

### [Location インターフェイス](https://developer.mozilla.org/ja/docs/Web/API/Location)

Location インターフェイスを引数に指定して初期化が可能。

```javascript
new MutableUrl(window.location);
```

## Property

- すべて ReadOnly
- Value は `new MutableUrl("https://example.com:1111/api/sub?a=foo&b=bar#hash")` の場合

### Original

| Property | Value |
| --- | --- |
| pathArray | ["api", "sub"] |
| searchObject | {a: "foo", b: "bar"} |

### URL インターフェイス

| Property | Value |
| --- | --- |
| protocol | https: |
| hostname | example.com |
| port | 1111 |
| host | example.com:1111 |
| origin | https://example.com:1111 |
| pathname | /api/sub |
| search | a=foo&b=bar |
| hash | hash |
| href | https://example.com:1111/api/sub?a=foo&b=bar#hash |

## Method

| Method | Argument | Overview | Example |
| --- | --- | --- | --- |
| toString | | URL を文字列で取得 | `url.toString()` |
| setSearch | string \| object | search パラメータを設定（上書き） | `url.setSearch("a=foo")` |
| mergeSearch | string \| object | search パラメータを設定（マージ） | `url.mergeSearch("a=foo")` |
| deleteSearch | string \| string[] | search パラメータの一部を削除 | `url.deleteSearch(["a", "b"])` |
| setHash | string | hash パラメータを設定 | `url.setHash("hash")` |
| setOrigin | string | origin を設定 | `url.setOrigin("http://example.net")` |
| setPathname | string \| string[] | pathname を設定 | `url.setPathname(["api", "sub"])` |
| format | string | 後述 | 後述 |

## format()

Property のうち `pathArray` `searchObject` `href` を除いたすべてを、`{property}` と記述することで文字列にて取得可能

```javascript
const url = new MutableUrl("https://example.com:1111/path/sub?a=foo&b=bar#hash");

url.format("{protocol}//{hostname}:{port}{pathname}?{search}#{hash}");
// https://example.com:1111/path/sub?a=foo&b=bar#hash

url.format("{protocol}//{host}{pathname}?{search}#{hash}");
// https://example.com:1111/path/sub?a=foo&b=bar#hash

url.format("{origin}{pathname}?{search}#{hash}");
// https://example.com:1111/path/sub?a=foo&b=bar#hash
```

## URLSearchParams との組み合わせ

IE11 に対応するため SearchParams の操作は最低限の API のみ。
IE11 の対応が不要、もしくは Polyfill を導入した環境であれば `URLSearchParams` と組み合わせて利用可能

```javascript
const url = new MutableUrl("https://example.com:1111/path/sub?a=foo&b=bar#hash");

const searchParams = new URLSearchParams(url.search);

if (searchParams.has("a")) {
    console.log(searchParams.get("a"));
    searchParams.append("c", "buz");
}

url.setSearch(searchParams.toString());

console.log(url.toString());
// https://example.com:1111/path/sub?a=foo&b=bar&c=buz#hash
```
