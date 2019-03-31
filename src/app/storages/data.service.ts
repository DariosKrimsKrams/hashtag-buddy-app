import { Injectable } from "@angular/core";
let LocalStorage = require( "nativescript-localstorage" );
 
@Injectable({
    providedIn: "root"
})
export class DataService {

    constructor(
    ) { }

    public remove(key: string): void {
        LocalStorage.removeItem(key);
    }

    public get(key: string): string {
        return LocalStorage.getItem(key) || undefined;
    }

    public setString(key: string, value: string) {
        LocalStorage.setItem(key, value);
    }

    public setObject(key: string, value: object) {
        var json = JSON.stringify(value);
        LocalStorage.setItem(key, json);
    }

    public has(key: string): boolean {
        return this.get(key) !== undefined;
    }
    
}
