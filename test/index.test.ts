import MutableUrl from "../src";

describe("MutableUrl", () => {
  it("フルパス", () => {
    const input = "https://example.com:1111/abc/def?test=test#hash";
    const target = new MutableUrl(input);
    expect(target.hash).toEqual("hash");
    expect(target.hostname).toEqual("example.com");
    expect(target.pathname).toEqual("/abc/def");
    expect(target.port).toEqual("1111");
    expect(target.protocol).toEqual("https:");
    expect(target.search).toEqual("test=test");
    expect(target.host).toEqual("example.com:1111");
    expect(target.origin).toEqual("https://example.com:1111");
    expect(target.href).toEqual(input);
    expect(target.toString()).toEqual(input);
  });

  it("フルパス portなし", () => {
    const input = "https://example.com/abc/def?test=test#hash";
    const target = new MutableUrl(input);
    expect(target.hash).toEqual("hash");
    expect(target.hostname).toEqual("example.com");
    expect(target.pathname).toEqual("/abc/def");
    expect(target.port).toEqual("");
    expect(target.protocol).toEqual("https:");
    expect(target.search).toEqual("test=test");
    expect(target.host).toEqual("example.com");
    expect(target.origin).toEqual("https://example.com");
    expect(target.href).toEqual(input);
    expect(target.toString()).toEqual(input);
  });

  it("フルパス searchなし", () => {
    const input = "https://example.com/abc/def";
    const target = new MutableUrl(input);
    expect(target.hash).toEqual("");
    expect(target.hostname).toEqual("example.com");
    expect(target.pathname).toEqual("/abc/def");
    expect(target.port).toEqual("");
    expect(target.protocol).toEqual("https:");
    expect(target.search).toEqual("");
    expect(target.host).toEqual("example.com");
    expect(target.origin).toEqual("https://example.com");
    expect(target.href).toEqual(input);
    expect(target.toString()).toEqual(input);
  });

  it("ドメインなし", () => {
    const input = "/abc/def?test=test#hash";
    const target = new MutableUrl(input);
    expect(target.hash).toEqual("hash");
    expect(target.hostname).toEqual("");
    expect(target.pathname).toEqual("/abc/def");
    expect(target.port).toEqual("");
    expect(target.protocol).toEqual("");
    expect(target.search).toEqual("test=test");
    expect(target.host).toEqual("");
    expect(target.origin).toEqual("");
    expect(target.href).toEqual(input);
    expect(target.toString()).toEqual(input);
  });

  it("pathのみ", () => {
    const input = "/abc/def";
    const target = new MutableUrl(input);
    expect(target.hash).toEqual("");
    expect(target.hostname).toEqual("");
    expect(target.pathname).toEqual("/abc/def");
    expect(target.port).toEqual("");
    expect(target.protocol).toEqual("");
    expect(target.search).toEqual("");
    expect(target.host).toEqual("");
    expect(target.origin).toEqual("");
    expect(target.href).toEqual(input);
    expect(target.toString()).toEqual(input);
  });

  it("searchのみ", () => {
    const input = "test=test#hash";
    const target = new MutableUrl(input);
    expect(target.hash).toEqual("hash");
    expect(target.hostname).toEqual("");
    expect(target.pathname).toEqual("");
    expect(target.port).toEqual("");
    expect(target.protocol).toEqual("");
    expect(target.search).toEqual("test=test");
    expect(target.host).toEqual("");
    expect(target.origin).toEqual("");
    expect(target.href).toEqual(input);
    expect(target.toString()).toEqual(input);
  });

  it("searchObject取得", () => {
    const input = "https://example.com:1111/abc/def?test=test&jest=abc#hash";
    const target = new MutableUrl(input);
    expect(target.searchObject).toEqual({
      test: "test",
      jest: "abc",
    });
    expect(target.toString()).toEqual(input);
  });

  it("setSearch(object)", () => {
    const input = "https://example.com:1111/abc/def?test=test&jest=abc#hash";
    const target = new MutableUrl(input);
    target.setSearch({ just: "def" });
    expect(target.searchObject).toEqual({
      just: "def",
    });
    expect(target.search).toEqual("just=def");
  });

  it("setSearch(string)", () => {
    const input = "https://example.com/abc/def";
    const search = "test=test";
    const target = new MutableUrl(input);
    target.setSearch(search);
    expect(target.search).toEqual(search);
    expect(target.searchObject).toEqual({ test: "test" });
    expect(target.toString()).toEqual(input + "?" + search);
  });

  it("setSearch(上書き)", () => {
    const input = "https://example.com/abc/def?a=b";
    const search = "a=c&test=test";
    const target = new MutableUrl(input);
    target.setSearch(search);
    expect(target.search).toEqual(search);
    expect(target.searchObject).toEqual({ a: "c", test: "test" });
    expect(target.toString()).toEqual("https://example.com/abc/def?" + search);
  });

  it("setSearch(置き換え)", () => {
    const input = "https://example.com/abc/def?a=b";
    const search = "test=test";
    const target = new MutableUrl(input);
    target.setSearch(search);
    expect(target.search).toEqual(search);
    expect(target.searchObject).toEqual({ test: "test" });
    expect(target.toString()).toEqual("https://example.com/abc/def?" + search);
  });

  it("mergeSearch(string)", () => {
    const input = "https://example.com/abc/def?a=b";
    const search = "test=test";
    const target = new MutableUrl(input);
    target.mergeSearch(search);
    expect(target.search).toEqual("a=b&" + search);
    expect(target.searchObject).toEqual({ a: "b", test: "test" });
    expect(target.toString()).toEqual(input + "&" + search);
  });

  it("mergeSearch(object)", () => {
    const input = "https://example.com:1111/abc/def?test=test&jest=abc#hash";
    const target = new MutableUrl(input);
    target.mergeSearch({ just: "def" });
    expect(target.searchObject).toEqual({
      test: "test",
      jest: "abc",
      just: "def",
    });
    expect(target.search).toEqual("test=test&jest=abc&just=def");
  });

  it("deleteSearch(string)", () => {
    const input = "https://example.com:1111/abc/def?test=test&jest=abc#hash";
    const target = new MutableUrl(input);
    target.deleteSearch("test");
    expect(target.search).toEqual("jest=abc");
  });

  it("deleteSearch(array)", () => {
    const input = "https://example.com:1111/abc/def?test=test&jest=abc#hash";
    const target = new MutableUrl(input);
    target.deleteSearch(["test", "jest"]);
    expect(target.search).toEqual("");
  });

  it("setHash", () => {
    const input = "https://example.com/abc/def?a=b";
    const hash = "hash";
    const target = new MutableUrl(input);
    target.setHash(hash);
    expect(target.hash).toEqual(hash);
    expect(target.toString()).toEqual(input + "#" + hash);
  });

  it("setOrigin", () => {
    const input = ["/abc/def?test=test#hash", "https://example.com:1111"];
    const target = new MutableUrl(input[0]);
    target.setOrigin(input[1]);
    expect(target.protocol).toEqual("https:");
    expect(target.hostname).toEqual("example.com");
    expect(target.port).toEqual("1111");
    expect(target.toString()).toEqual(input[1] + input[0]);
  });

  const cases = [
    ["{pathname}?{search}", "/abc/def?test=test"],
    ["{pathname}#{hash}", "/abc/def#hash"],
    ["{hostname}{pathname}", "example.com/abc/def"],
  ];
  it.each(cases)("format(%s)", (format, expected) => {
    const input = "https://example.com:1111/abc/def?test=test#hash";
    const target = new MutableUrl(input);
    expect(target.format(format)).toEqual(expected);
  });

  it("setPathname", () => {
    const input = "https://example.com/abc/def";
    const target = new MutableUrl(input);
    expect(target.pathArray).toEqual(["abc", "def"]);

    target.setPathname(["directory", ...target.pathArray]);
    expect(target.pathname).toEqual("/directory/abc/def");
    expect(target.toString()).toEqual("https://example.com/directory/abc/def");

    const pathArray = target.pathArray;
    pathArray[0] = "api";
    target.setPathname(pathArray);
    expect(target.pathname).toEqual("/api/abc/def");
    expect(target.toString()).toEqual("https://example.com/api/abc/def");
  });

  it("README example 1", () => {
    const url = new MutableUrl("/path/sub?a=foo");

    url.setOrigin("https://example.com:1111");
    expect(url.toString()).toEqual("https://example.com:1111/path/sub?a=foo");

    url.setHash("hash");
    expect(url.toString()).toEqual(
      "https://example.com:1111/path/sub?a=foo#hash"
    );

    expect(url.searchObject).toEqual({ a: "foo" });

    url.mergeSearch({ b: "bar" });
    expect(url.toString()).toEqual(
      "https://example.com:1111/path/sub?a=foo&b=bar#hash"
    );

    const paths = url.pathArray;
    expect(paths).toEqual(["path", "sub"]);

    paths[0] = "api";
    url.setPathname(paths);
    expect(url.toString()).toEqual(
      "https://example.com:1111/api/sub?a=foo&b=bar#hash"
    );

    expect(url.format("http://{hostname}{pathname}?{search}")).toEqual(
      "http://example.com/api/sub?a=foo&b=bar"
    );
  });

  it("README example 2", () => {
    const url = new MutableUrl(
      "https://example.com:1111/path/sub?a=foo&b=bar#hash"
    );

    expect(
      url.format("{protocol}//{hostname}:{port}{pathname}?{search}#{hash}")
    ).toEqual("https://example.com:1111/path/sub?a=foo&b=bar#hash");

    expect(url.format("{protocol}//{host}{pathname}?{search}#{hash}")).toEqual(
      "https://example.com:1111/path/sub?a=foo&b=bar#hash"
    );

    expect(url.format("{origin}{pathname}?{search}#{hash}")).toEqual(
      "https://example.com:1111/path/sub?a=foo&b=bar#hash"
    );
  });
});
