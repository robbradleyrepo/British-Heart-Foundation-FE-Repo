export class SessionStorageBase {
    private storageObject: Storage;

    constructor() { 
        this.storageObject = window.sessionStorage;
    }

    //used to add new or update existing session storage items.
    public setItem<T>(key: string, item: T): void {
        this.storageObject.setItem(key, JSON.stringify(item));
    }

    //used to get an item from a session storage, already parsed.
    public getItem<T>(key: string): T {
        let data: any = this.storageObject.getItem(key);
        if (!data) {
            return null;
        }
        
        let object: T;

        try {
            object = <T>JSON.parse(data);
        } catch  (error) {
            object = null;
        }

        return object;
    }

    //remove an item from a session storage.
    public deleteItem(key: string): void {
        this.storageObject.removeItem(key);
    }

    //used to get all items from a session storage - returns an array of objects ready to use, already parsed.
    public getAllItems<T>(): T[] {
        let objectArray: T[];
        if (this.storageObject.length > 0) {
            for (let i = 0; i < this.storageObject.length; i++) {
                let singleObject = this.getItem(this.storageObject.key(i));
                objectArray.push(<T>singleObject);
            }
        }

        return objectArray;
    }

    public getItemsCount(): Number {
        return this.storageObject.length;
    }
}

$(() => {
    if (window.sessionStorage) {
        let sessionStorageObject: any = new SessionStorageBase();
    }
});