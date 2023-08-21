import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";
import {Utility} from "../Utility";
import {WellKnownTypesMap} from "../WellKnown";
import {MessageFormatter} from "./partial/MessageFormatter";
import {ExtensionFormatter} from "./partial/ExtensionFormatter";
import {EnumFormatter} from "./partial/EnumFormatter";
import {DependencyFilter} from "../DependencyFilter";
import {TplEngine} from "../TplEngine";

export namespace ProtoMsgTsFormatter {

    export interface IProtoMsgModel {
        packageName: string;
        fileName: string;
        imports: string[];
        messages: MessageFormatter.IMessageModel[];
        extensions: ExtensionFormatter.IExtensionModel[];
        enums: EnumFormatter.IEnumModel[];
    }

    export function format(descriptor: FileDescriptorProto, exportMap: ExportMap): IProtoMsgModel {
        const fileName = descriptor.getName();
        const packageName = descriptor.getPackage();

        const imports: string[] = [];
        const messages: MessageFormatter.IMessageModel[] = [];
        const extensions: ExtensionFormatter.IExtensionModel[] = [];
        const enums: EnumFormatter.IEnumModel[] = [];

        const upToRoot = Utility.getPathToRoot(fileName);

        imports.push(`import * as jspb from "google-protobuf";`);
        descriptor.getDependencyList().forEach((dependency: string) => {
            if (DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            const pseudoNamespace = Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnownTypesMap[dependency]}";`);
            } else {
                const filePath = Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}";`);
            }
        });

        // Only if this contains a message called "DatabaseDoc"
        descriptor.getMessageTypeList().forEach((enumType) => {
            messages.push(MessageFormatter.format(fileName, exportMap, enumType, "", descriptor));
        });
        // Only if this contains a message called "@Translation"
        descriptor.getEnumTypeList().forEach((enumType) => {
            enums.push(EnumFormatter.format(enumType, descriptor, ""));
        });

        TplEngine.registerHelper("formatName", (str) => {
            return Utility.formatOccupiedName(str);
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

}
