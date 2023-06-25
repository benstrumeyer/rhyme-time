"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.find_lyrics = void 0;
var cheerio = require("cheerio");
function find_lyrics(query_string) {
    return __awaiter(this, void 0, void 0, function () {
        var query, genius_search, genius_result, elements, lyrics_1, musix_search, musix_first_element, musix_result, lyrics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!query_string)
                        return [2 /*return*/, new Error("Query string required.")];
                    query = encodeURI(query_string).replace(" ", "+");
                    return [4 /*yield*/, fetch("https://genius.com/api/search/song?page=1&q=" + query)
                            .then(function (response) { return response.json(); })
                            .catch(function (error) { return error.message ? error : new Error(error); })];
                case 1:
                    genius_search = _a.sent();
                    if (genius_search instanceof Error)
                        return [2 /*return*/, genius_search];
                    if (!genius_search.response.sections[0].hits[0]) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch("https://genius.com" + genius_search.response.sections[0].hits[0].result.path)
                            .then(function (response) { return response.text(); })
                            .catch(function (error) { return error.message ? error : new Error(error); })];
                case 2:
                    genius_result = _a.sent();
                    if (genius_result instanceof Error)
                        return [2 /*return*/, genius_result];
                    elements = cheerio.load(genius_result)("div[data-lyrics-container|=true]");
                    if (elements.text()) {
                        lyrics_1 = "";
                        elements.each(function (_, elem) {
                            lyrics_1 += cheerio.load(cheerio.load(elem).html().replace(/<br>/gi, "\n")).text();
                            lyrics_1 += "\n";
                        });
                        return [2 /*return*/, lyrics_1];
                    }
                    _a.label = 3;
                case 3: return [4 /*yield*/, fetch("https://www.musixmatch.com/search/" + query)
                        .then(function (response) { return response.text(); })
                        .catch(function (error) { return error.message ? error : new Error(error); })];
                case 4:
                    musix_search = _a.sent();
                    if (musix_search instanceof Error)
                        return [2 /*return*/, musix_search];
                    musix_first_element = cheerio.load(musix_search)(".media-card-title a")[0];
                    if (!musix_first_element) return [3 /*break*/, 6];
                    return [4 /*yield*/, fetch("https://www.musixmatch.com" + musix_first_element.attribs.href)
                            .then(function (response) { return response.text(); })
                            .catch(function (error) { return error.message ? error : new Error(error); })];
                case 5:
                    musix_result = _a.sent();
                    if (musix_result instanceof Error)
                        return [2 /*return*/, musix_result];
                    lyrics = cheerio.load(musix_result)(".mxm-lyrics .lyrics__content__ok");
                    if (lyrics)
                        return [2 /*return*/, lyrics.text()];
                    _a.label = 6;
                case 6: return [2 /*return*/, new Error("Could not find lyrics for: \"".concat(query_string, "\""))];
            }
        });
    });
}
exports.find_lyrics = find_lyrics;
