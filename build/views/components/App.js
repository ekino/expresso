"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const List_1 = __importDefault(require("./List"));
const ListItem_1 = __importDefault(require("./ListItem"));
const App = ({ data }) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(ListItem_1.default, { title: "Original call", item: data === null || data === void 0 ? void 0 : data.originalCall }),
    react_1.default.createElement(List_1.default, { title: "Underlying calls", items: data === null || data === void 0 ? void 0 : data.underlyingCalls })));
exports.default = App;
//# sourceMappingURL=App.js.map