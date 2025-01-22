import * as cp from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';
import * as path from 'path';

import { ensureKiotaIsPresent, getKiotaPath } from './kiotaInstall';
import { KiotaLogEntry, LogLevel, MaturityLevel, DependencyType, KiotaGenerationLanguage } from './types';

export function getWorkspaceJsonDirectory(): string {
    return path.join(__dirname, '..');
}

export async function connectToKiota<T>(callback: (connection: rpc.MessageConnection) => Promise<T | undefined>, workingDirectory: string = getWorkspaceJsonDirectory()): Promise<T | undefined> {
    console.log('connecting to kiota');
    const kiotaPath = getKiotaPath();
    await ensureKiotaIsPresent();
    const childProcess = cp.spawn(kiotaPath, ["rpc"], {
        cwd: workingDirectory,
        env: {
            ...process.env,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            KIOTA_CONFIG_PREVIEW: "true",
        }
    });
    let connection = rpc.createMessageConnection(
        new rpc.StreamMessageReader(childProcess.stdout),
        new rpc.StreamMessageWriter(childProcess.stdin));
    connection.listen();
    try {
        console.log('making request');
        return await callback(connection);
    } catch (error) {
        const errorMessage = (error as { data?: { message: string } })?.data?.message
            || 'An unknown error occurred';
        console.warn(errorMessage);
    } finally {
        connection.dispose();
        childProcess.kill();
    }
}

export function generationLanguageToString(language: KiotaGenerationLanguage): string {
    switch (language) {
        case KiotaGenerationLanguage.CSharp:
            return "CSharp";
        case KiotaGenerationLanguage.Java:
            return "Java";
        case KiotaGenerationLanguage.TypeScript:
            return "TypeScript";
        case KiotaGenerationLanguage.PHP:
            return "PHP";
        case KiotaGenerationLanguage.Python:
            return "Python";
        case KiotaGenerationLanguage.Go:
            return "Go";
        case KiotaGenerationLanguage.Swift:
            return "Swift";
        case KiotaGenerationLanguage.Ruby:
            return "Ruby";
        case KiotaGenerationLanguage.CLI:
            return "CLI";
        case KiotaGenerationLanguage.Dart:
            return "Dart";
        default:
            throw new Error("unknown language");
    }
}

export function getLogEntriesForLevel(logEntries: KiotaLogEntry[], ...levels: LogLevel[]): KiotaLogEntry[] {
    return logEntries.filter((entry) => levels.indexOf(entry.level) !== -1);
}

export function maturityLevelToString(level: MaturityLevel): string {
    switch (level) {
        case MaturityLevel.experimental:
            return "experimental";
        case MaturityLevel.preview:
            return "preview";
        case MaturityLevel.stable:
            return "stable";
        default:
            throw new Error("unknown level");
    }
}

export function dependencyTypeToString(type: DependencyType): string {
    switch (type) {
        case DependencyType.abstractions:
            return "abstractions";
        case DependencyType.serialization:
            return "serialization";
        case DependencyType.authentication:
            return "authentication";
        case DependencyType.http:
            return "http";
        case DependencyType.bundle:
            return "bundle";
        case DependencyType.additional:
            return "additional";
        default:
            throw new Error("unknown type");
    }
}
