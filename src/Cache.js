import {v4 as uuid} from "uuid";
import {isProduction} from "./config/constants.js";

export class Cache {
	constructor() {
		this.cache = new Map();
		if (!isProduction) {
			this.cache.set("test", {wtf: false});
		}
	}

	create(payload) {
		const key = uuid();
		this.cache.set(key, payload);
		return key;
	}

	keys() {
		return [...this.cache.keys()];
	}

	get(key) {
		return this.cache.get(key);
	}

	update(key, payload) {
		const context = this.get(key);
		this.cache.set(key, {...context, ...payload});
		console.log(`Updated cache with key ${key}`, this.get(key));
		return this.get(key);
	}

	remove(key) {
		return this.cache.delete(key);
	}
}
