import { Injectable } from "@angular/core";
let LocalStorage = require( "nativescript-localstorage" );
 
@Injectable({
    providedIn: "root"
})
export class LocalStorageService {

    constructor(
    ) { }

    public remove(key: string): void {
        LocalStorage.removeItem(key);
    }

    public get(key: string): string {
        return LocalStorage.getItem(key) || undefined;
    }

    public set(key: string, value: any) {
        if (typeof value === 'string' || value instanceof String) {
            LocalStorage.setItem(key, value);
        } else {
            var json = JSON.stringify(value);
            LocalStorage.setItem(key, json);
        }
    }

    public has(key: string): boolean {
        return this.get(key) !== undefined;
    }
    
}
