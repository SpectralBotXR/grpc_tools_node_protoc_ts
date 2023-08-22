"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoMsgTsFormatter = void 0;
const Utility_1 = require("../Utility");
const WellKnown_1 = require("../WellKnown");
const MessageFormatter_1 = require("./partial/MessageFormatter");
const EnumFormatter_1 = require("./partial/EnumFormatter");
const DependencyFilter_1 = require("../DependencyFilter");
const TplEngine_1 = require("../TplEngine");
var ProtoMsgTsFormatter;
(function (ProtoMsgTsFormatter) {
    function format(descriptor, exportMap) {
        const fileName = descriptor.getName();
        const packageName = descriptor.getPackage();
        const imports = [];
        const messages = [];
        const extensions = [];
        const enums = [];
        const upToRoot = Utility_1.Utility.getPathToRoot(fileName);
        imports.push(`import * as jspb from "google-protobuf";`);
        descriptor.getDependencyList().forEach((dependency) => {
            if (DependencyFilter_1.DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            const pseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnown_1.WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnown_1.WellKnownTypesMap[dependency]}";`);
            }
            else {
                const filePath = Utility_1.Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}";`);
            }
        });
        // Only if this contains a message called "DatabaseDoc"
        descriptor.getMessageTypeList().forEach((enumType) => {
            messages.push(MessageFormatter_1.MessageFormatter.format(fileName, exportMap, enumType, "", descriptor));
        });
        // Only if this contains a message called "@Translation"
        descriptor.getEnumTypeList().forEach((enumType) => {
            enums.push(EnumFormatter_1.EnumFormatter.format(enumType, descriptor, ""));
        });
        TplEngine_1.TplEngine.registerHelper("formatName", (str) => {
            return Utility_1.Utility.formatOccupiedName(str);
        });
        return {
            packageName,
            fileName,
            imports,
            messages,
            extensions,
            enums,
        };
    }
    ProtoMsgTsFormatter.format = format;
})(ProtoMsgTsFormatter = exports.ProtoMsgTsFormatter || (exports.ProtoMsgTsFormatter = {}));
//# sourceMappingURL=ProtoMsgTsFormatter.js.map