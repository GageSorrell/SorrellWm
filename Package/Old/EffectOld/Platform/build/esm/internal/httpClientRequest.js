import * as Effect from "effect/Effect";
import * as Either from "effect/Either";
import { dual } from "effect/Function";
import * as Inspectable from "effect/Inspectable";
import * as Option from "effect/Option";
import { pipeArguments } from "effect/Pipeable";
import * as Redacted from "effect/Redacted";
import * as Headers from "../Headers.js";
import * as UrlParams from "../UrlParams.js";
import * as internalBody from "./httpBody.js";
/** @internal */
export const TypeId = Symbol.for("@effect/platform/HttpClientRequest");
const Proto = {
    [TypeId]: TypeId,
    ...Inspectable.BaseProto,
    toJSON() {
        return {
            _id: "@effect/platform/HttpClientRequest",
            method: this.method,
            url: this.url,
            urlParams: this.urlParams,
            hash: this.hash,
            headers: Inspectable.redact(this.headers),
            body: this.body.toJSON()
        };
    },
    pipe() {
        return pipeArguments(this, arguments);
    }
};
function makeInternal(method, url, urlParams, hash, headers, body) {
    const self = Object.create(Proto);
    self.method = method;
    self.url = url;
    self.urlParams = urlParams;
    self.hash = hash;
    self.headers = headers;
    self.body = body;
    return self;
}
/** @internal */
export const isClientRequest = (u) => typeof u === "object" && u !== null && TypeId in u;
/** @internal */
export const empty = makeInternal("GET", "", UrlParams.empty, Option.none(), Headers.empty, internalBody.empty);
/** @internal */
export const make = (method) => (url, options) => modify(empty, {
    method,
    url,
    ...(options ?? undefined)
});
/** @internal */
export const get = make("GET");
/** @internal */
export const post = make("POST");
/** @internal */
export const put = make("PUT");
/** @internal */
export const patch = make("PATCH");
/** @internal */
export const del = make("DELETE");
/** @internal */
export const head = make("HEAD");
/** @internal */
export const options = make("OPTIONS");
/** @internal */
export const modify = dual(2, (self, options) => {
    let result = self;
    if (options.method) {
        result = setMethod(result, options.method);
    }
    if (options.url) {
        result = setUrl(result, options.url);
    }
    if (options.headers) {
        result = setHeaders(result, options.headers);
    }
    if (options.urlParams) {
        result = setUrlParams(result, options.urlParams);
    }
    if (options.hash) {
        result = setHash(result, options.hash);
    }
    if (options.body) {
        result = setBody(result, options.body);
    }
    if (options.accept) {
        result = accept(result, options.accept);
    }
    if (options.acceptJson) {
        result = acceptJson(result);
    }
    return result;
});
/** @internal */
export const setHeader = dual(3, (self, key, value) => makeInternal(self.method, self.url, self.urlParams, self.hash, Headers.set(self.headers, key, value), self.body));
/** @internal */
export const setHeaders = dual(2, (self, input) => makeInternal(self.method, self.url, self.urlParams, self.hash, Headers.setAll(self.headers, input), self.body));
const stringOrRedacted = (value) => typeof value === "string" ? value : Redacted.value(value);
/** @internal */
export const basicAuth = dual(3, (self, username, password) => setHeader(self, "Authorization", `Basic ${btoa(`${stringOrRedacted(username)}:${stringOrRedacted(password)}`)}`));
/** @internal */
export const bearerToken = dual(2, (self, token) => setHeader(self, "Authorization", `Bearer ${stringOrRedacted(token)}`));
/** @internal */
export const accept = dual(2, (self, mediaType) => setHeader(self, "Accept", mediaType));
/** @internal */
export const acceptJson = accept("application/json");
/** @internal */
export const setMethod = dual(2, (self, method) => makeInternal(method, self.url, self.urlParams, self.hash, self.headers, self.body));
/** @internal */
export const setUrl = dual(2, (self, url) => {
    if (typeof url === "string") {
        return makeInternal(self.method, url, self.urlParams, self.hash, self.headers, self.body);
    }
    const clone = new URL(url.toString());
    const urlParams = UrlParams.fromInput(clone.searchParams);
    const hash = clone.hash ? Option.some(clone.hash.slice(1)) : Option.none();
    clone.search = "";
    clone.hash = "";
    return makeInternal(self.method, clone.toString(), urlParams, hash, self.headers, self.body);
});
/** @internal */
export const appendUrl = dual(2, (self, path) => {
    if (path === "") {
        return self;
    }
    const baseUrl = self.url.endsWith("/") ? self.url : self.url + "/";
    const pathSegment = path.startsWith("/") ? path.slice(1) : path;
    return makeInternal(self.method, baseUrl + pathSegment, self.urlParams, self.hash, self.headers, self.body);
});
/** @internal */
export const prependUrl = dual(2, (self, url) => makeInternal(self.method, url.endsWith("/") && self.url.startsWith("/") ?
    url + self.url.slice(1) :
    url + self.url, self.urlParams, self.hash, self.headers, self.body));
/** @internal */
export const updateUrl = dual(2, (self, f) => makeInternal(self.method, f(self.url), self.urlParams, self.hash, self.headers, self.body));
/** @internal */
export const appendUrlParam = dual(3, (self, key, value) => makeInternal(self.method, self.url, UrlParams.append(self.urlParams, key, value), self.hash, self.headers, self.body));
/** @internal */
export const appendUrlParams = dual(2, (self, input) => makeInternal(self.method, self.url, UrlParams.appendAll(self.urlParams, input), self.hash, self.headers, self.body));
/** @internal */
export const setUrlParam = dual(3, (self, key, value) => makeInternal(self.method, self.url, UrlParams.set(self.urlParams, key, value), self.hash, self.headers, self.body));
/** @internal */
export const setUrlParams = dual(2, (self, input) => makeInternal(self.method, self.url, UrlParams.setAll(self.urlParams, input), self.hash, self.headers, self.body));
/** @internal */
export const setHash = dual(2, (self, hash) => makeInternal(self.method, self.url, self.urlParams, Option.some(hash), self.headers, self.body));
/** @internal */
export const removeHash = (self) => makeInternal(self.method, self.url, self.urlParams, Option.none(), self.headers, self.body);
/** @internal */
export const toUrl = (self) => Either.getRight(UrlParams.makeUrl(self.url, self.urlParams, self.hash));
/** @internal */
export const setBody = dual(2, (self, body) => {
    let headers = self.headers;
    if (body._tag === "Empty" || body._tag === "FormData") {
        headers = Headers.remove(headers, ["Content-type", "Content-length"]);
    }
    else {
        const contentType = body.contentType;
        if (contentType) {
            headers = Headers.set(headers, "content-type", contentType);
        }
        const contentLength = body.contentLength;
        if (contentLength) {
            headers = Headers.set(headers, "content-length", contentLength.toString());
        }
    }
    return makeInternal(self.method, self.url, self.urlParams, self.hash, headers, body);
});
/** @internal */
export const bodyUint8Array = dual((args) => isClientRequest(args[0]), (self, body, contentType = "application/octet-stream") => setBody(self, internalBody.uint8Array(body, contentType)));
/** @internal */
export const bodyText = dual((args) => isClientRequest(args[0]), (self, body, contentType = "text/plain") => setBody(self, internalBody.text(body, contentType)));
/** @internal */
export const bodyJson = dual(2, (self, body) => Effect.map(internalBody.json(body), (body) => setBody(self, body)));
/** @internal */
export const bodyUnsafeJson = dual(2, (self, body) => setBody(self, internalBody.unsafeJson(body)));
/** @internal */
export const bodyFile = dual((args) => isClientRequest(args[0]), (self, path, options) => Effect.map(internalBody.file(path, options), (body) => setBody(self, body)));
/** @internal */
export const bodyFileWeb = dual(2, (self, file) => setBody(self, internalBody.fileWeb(file)));
/** @internal */
export const schemaBodyJson = (schema, options) => {
    const encode = internalBody.jsonSchema(schema, options);
    return dual(2, (self, body) => Effect.map(encode(body), (body) => setBody(self, body)));
};
/** @internal */
export const bodyUrlParams = dual(2, (self, body) => setBody(self, internalBody.text(UrlParams.toString(UrlParams.fromInput(body)), "application/x-www-form-urlencoded")));
/** @internal */
export const bodyFormData = dual(2, (self, body) => setBody(self, internalBody.formData(body)));
/** @internal */
export const bodyFormDataRecord = dual(2, (self, entries) => setBody(self, internalBody.formDataRecord(entries)));
/** @internal */
export const bodyStream = dual((args) => isClientRequest(args[0]), (self, body, { contentLength, contentType = "application/octet-stream" } = {}) => setBody(self, internalBody.stream(body, contentType, contentLength)));
//# sourceMappingURL=httpClientRequest.js.map