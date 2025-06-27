import { v4 as uuid } from "uuid";

export class Cache {
	constructor() {
		this.cache = new Map();
	}

	/**
	 * Create a new key with associated data.
	 * @param payload {any} - The data to associate with the new key
	 * @returns key {string} - A unique identifier for the created cache entry
	 */
	create(payload) {
		const key = uuid();
		this.cache.set(key, payload);
		return key;
	}

	/**
	 * Retrieve all keys in the cache.
	 * @returns {string[]}
	 */
	keys() {
		return [...this.cache.keys()];
	}

	/**
	 * Retrieve the value associated with a given key.
	 * @param key {string} - The key to look up in the cache
	 * @returns {any} - The value associated with the key
	 */
	get(key) {
		return this.cache.get(key);
	}

	/**
	 * Update an existing key with new data.
	 * @param key {string} - The key to update
	 * @param payload {any} - The new data to associate with the key
	 */
	update(key, payload) {
		const context = this.get(key);
		this.cache.set(key, { ...context, ...payload });
		console.log(`Updated cache with key ${key}`, this.get(key));
		return this.get(key);
	}

	/**
	 * Remove a key and its associated data from the cache.
	 * @param key {string} - The key to remove
	 */
	remove(key) {
		return this.cache.delete(key);
	}
}
