"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ListItem_1 = __importDefault(require("./ListItem"));
const List = ({ items, title }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h2", null, title),
        renderJSONViews(items, title)));
};
const renderJSONViews = (items, title) => {
    return items
        ? items.map((item) => (react_1.default.createElement(ListItem_1.default, { item: item, key: item.id })))
        : null;
};
exports.default = List;
//# sourceMappingURL=List.js.map