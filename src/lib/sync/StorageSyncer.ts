import { Syncer, type SyncerOptions } from "./Syncer.js";

/** @internal Base class for `localStorage` and `sessionStorage` */
export abstract class StorageSyncer<T> extends Syncer<T> {
	/** Key for `Storage` */
	public readonly key: string;

	/** @inheritdoc */
	protected get storageKey(): string {
		return this.key;
	}

	/** @internal */
	protected abstract getStorage(): Storage | null;

	/** Create a new instance
	 * @param options Optional parameters */
	public constructor(key: string, options?: SyncerOptions<T>) {
		super(options);
		this.key = key;

		// Set key to initialValue if set
		if (typeof options?.initialValue === "undefined") {
			return;
		}
		const storage = this.getStorage();
		if (storage && !(this.key in storage)) {
			this.sync(options.initialValue);
		}
	}

	/** @inheritdoc */
	public tryGet(): T | undefined {
		try {
			const storage = this.getStorage();
			if (storage) {
				const str = storage.getItem(this.key);
				if (str !== null) {
					return this.deserializer?.(str) ?? JSON.parse(str);
				}
			} else if (typeof this.serverValue !== "undefined") {
				return this.serverValue;
			}
		} catch (e) {
			console.error(e);
		}
		return undefined;
	}

	/** Store value in `Storage` */
	public override sync(value: T): boolean {
		const storage = this.getStorage();
		if (storage) {
			storage.setItem(this.key, this.serializer?.(value) ?? JSON.stringify(value));
		}
		return false;
	}
}
