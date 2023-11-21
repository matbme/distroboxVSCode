import * as vscode from "vscode";
import { execSync } from "child_process";

export function startContainer(name: string) {
    try {
        execSync(`distrobox enter ${name} -- sh -c 'exit'`);
    } catch(e: any) {
        vscode.window.showErrorMessage("Failed to start container " + name + ": " + e);
    }
}

export function stopContainer(name: string) {
    try {
        execSync(`distrobox stop -Y ${name}`);
    } catch(e: any) {
        vscode.window.showErrorMessage("Failed to stop container " + name + ": " + e);
    }
}

export function attachToContainer(name: string) {
    vscode.commands.executeCommand("remote-containers.attachToRunningContainerFromViewlet", name);
}