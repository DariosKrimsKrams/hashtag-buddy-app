import { Injectable } from "@angular/core";
let LocalStorage = require( "nativescript-localstorage" );
 
@Injectable({
    providedIn: "root"
})
export class DataService {

    constructor(
    ) { }

    public clearAll(): void {
        LocalStorage.removeItem('photos');
        LocalStorage.removeItem('userId');
    }

    public get(key: string): any {
        return LocalStorage.getItem(key) || undefined;
    }

    public set(key: string, value: any) {
        LocalStorage.setItem(key, value);
    }

    public has(key: string): boolean {
        return this.get(key) !== undefined;
    }

    private isEmpty(): boolean {
        return LocalStorage.length == 0;
    }
    
}
