export default class MutableUrl {
  private _hash: string = "";
  private _hostname: string = "";
  private _pathname: string = "";
  private _port: string = "";
  private _protocol: string = "";
  private _search: string = "";

  get hash() {
    return this._hash;
  }
  get hostname() {
    return this._hostname;
  }
  get pathname() {
    return this._pathname;
  }
  get port() {
    return this._port;
  }
  get protocol() {
    return this._protocol;
  }
  get search() {
    return this._search;
  }
  get searchObject() {
    return this._parseSearch(this._search);
  }
  get host() {
    return (
      (this._hostname && this._hostname) + (this._port && `:${this._port}`)
    );
  }
  get origin() {
    return (
      (this._protocol && `${this._protocol}//`) +
      (this._hostname && this._hostname) +
      (this._port && `:${this._port}`)
    );
  }
  get href() {
    return this.toString();
  }
  get pathArray() {
    return this._pathname.split("/").filter((path) => path !== "");
  }

  constructor(arg: string | Location) {
    if (arg instanceof Location) {
      this._setLocation(arg);
      return;
    }

    const urls = MutableUrl.parseQuery(arg);
    this._search = urls.search;
    this._hash = urls.hash;

    const origin = MutableUrl.parseOrigin(urls.other);
    this._protocol = origin.protocol;
    this._hostname = origin.hostname;
    this._port = origin.port;
    this._pathname = origin.pathname;
  }

  private _parseSearch(searchString: string) {
    const obj: { [key: string]: string } = {};
    searchString.split("&").forEach((s) => {
      const keyValue = s.split("=");
      if (keyValue.length !== 2) return;
      obj[keyValue[0]] = keyValue[1];
    });
    return obj;
  }

  private _stringifySearch(searchObject: { [key: string]: string }) {
    return Object.keys(searchObject)
      .map((key) => `${key}=${searchObject[key]}`)
      .join("&");
  }

  private _setLocation(location: Location) {
    this._protocol = location.protocol;
    this._hostname = location.hostname;
    this._port = location.port;
    this._pathname = location.pathname;
    this._search = location.search;
    this._hash = location.hash;
  }

  public static parseQuery(url: string) {
    const result = {
      search: "",
      hash: "",
    };

    if (url.indexOf("/") === -1) {
      const queryString = url.replace("?", "");
      const queries = queryString.split("#");
      if (queries.length > 1) {
        result.hash = queries[1];
      }
      result.search = queries[0];

      return { ...result, other: "" };
    }

    const urls = url.split("?");
    if (urls.length > 1) {
      const queries = urls[1].split("#");
      if (queries.length > 1) {
        result.hash = queries[1];
      }
      result.search = queries[0];
    }

    return { ...result, other: urls[0] };
  }

  public static parseOrigin(origin: string) {
    const result = {
      protocol: "",
      port: "",
      hostname: "",
      pathname: "",
    };

    const heads = origin.split("//");
    let path: string;
    if (heads.length > 1) {
      result.protocol = heads[0];
      path = heads[1];
    } else {
      path = heads[0];
    }

    const directories = path.split("/");
    const domains = directories[0].split(":");
    if (domains.length > 1) {
      result.port = domains[1];
    }

    result.hostname = domains[0];
    result.pathname = directories.reduce((previous, current, index) => {
      if (index === 0) return "";
      if (index === 1) return "/" + current;
      return previous + "/" + current;
    });

    return result;
  }

  public setSearch(arg: { [key: string]: string } | string) {
    const newSearchObject =
      typeof arg === "string" ? this._parseSearch(arg) : arg;
    this._search = this._stringifySearch(newSearchObject);
  }

  public mergeSearch(arg: { [key: string]: string } | string) {
    const current = this.searchObject;
    const next = typeof arg === "string" ? this._parseSearch(arg) : arg;
    const newSearchObject = { ...current, ...next };
    this._search = this._stringifySearch(newSearchObject);
  }

  public deleteSearch(key: string | string[]) {
    const searchObject = this.searchObject;
    if (typeof key === "string") {
      if (key in searchObject) delete searchObject[key];
    } else {
      key.forEach((k) => {
        if (k in searchObject) delete searchObject[k];
      });
    }
    this._search = this._stringifySearch(searchObject);
  }

  public setHash(arg: string) {
    this._hash = arg;
  }

  public setOrigin(origin: string) {
    const result = MutableUrl.parseOrigin(origin);
    this._protocol = result.protocol;
    this._hostname = result.hostname;
    this._port = result.port;
  }

  public setPathname(pathname: string | string[]) {
    if (typeof pathname === "string") {
      this._pathname = pathname;
      return;
    }

    const tmp = pathname.filter((path) => path !== "").join("/");
    this._pathname = tmp ? "/" + tmp : "";
  }

  public toString() {
    return (
      (this._protocol && `${this._protocol}//`) +
      (this._hostname && this._hostname) +
      (this._port && `:${this._port}`) +
      (this._pathname && this._pathname) +
      (this._search && (this._pathname ? `?${this._search}` : this._search)) +
      (this._hash && `#${this._hash}`)
    );
  }

  public format(format: string) {
    return format
      .replace("{protocol}", this.protocol)
      .replace("{origin}", this.origin)
      .replace("{host}", this.host)
      .replace("{hostname}", this.hostname)
      .replace("{port}", this.port)
      .replace("{pathname}", this.pathname)
      .replace("{search}", this.search)
      .replace("{hash}", this.hash);
  }
}
