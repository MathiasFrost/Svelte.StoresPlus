import { Syncer, type SyncerOptions } from "./Syncer.js";

/** Optional parameters */
export type CookieSyncerOptions<T> = SyncerOptions<T> & {
	/** Domain to set on cookie */
	domain?: string;

	/** Expire time to set on cookie. Leave empty for session cookies */
	expires?: Date;

	/** Set cookie to HostOnly */
	hostOnly?: boolean;

	/** Set cookie to HttpOnly */
	httpOnly?: boolean;

	/** Set cookie to HttpOnly */
	path?: string;

	/** Cookie SameSite policy. Default = 'None' */
	sameSite?: "Lax" | "Strict" | "None";

	/** Set cookie to secure. Default true */
	secure?: boolean;
};

/** Replicate data to `cookie` */
export class CookieSyncer<T> extends Syncer<T> {
	/** @inheritdoc */
	protected get storageKey(): string {
		return this.name;
	}

	/** @inheritdoc */
	protected get storageName(): string {
		return "cookies";
	}

	/** Name of `cookie` */
	public name: string;

	/** Domain to set on cookie */
	public domain?: string;

	/** Expire time to set on cookie. Leave empty for session cookies */
	public expires?: Date;

	/** Set cookie to HostOnly */
	public hostOnly?: boolean;

	/** Set cookie to HttpOnly */
	public httpOnly?: boolean;

	/** Set cookie to HttpOnly */
	public path?: string;

	/** Cookie SameSite policy. Default = 'None' */
	public sameSite?: "Lax" | "Strict" | "None";

	/** Set cookie to secure. Default true */
	public secure?: boolean;

	/** Replicate data to `cookie`
	 * @param name Name of `cookie`
	 * @param options Optional parameters */
	public constructor(name: string, options?: CookieSyncerOptions<T>) {
		super(options);
		this.name = name;
		this.domain = options?.domain;
		this.expires = options?.expires;
		this.hostOnly = options?.hostOnly;
		this.httpOnly = options?.httpOnly;
		this.path = options?.path;
		this.sameSite = options?.sameSite ?? "None";
		this.secure = options?.secure ?? true;

		// Set key to initialValue if set
		if (typeof options?.initialValue === "undefined") {
			return;
		}
		const cookies = typeof document === "undefined" ? null : document.cookie;
		if (!cookies) {
			return;
		}
		const exists = document.cookie.split("; ").some((row) => row.startsWith(`${this.name}=`));
		if (!exists) {
			this.sync(options.initialValue);
		}
	}

	/** @inheritdoc */
	public tryGet(): T | undefined {
		try {
			const str = document.cookie
				.split("; ")
				.find((row) => row.startsWith(`${this.name}=`))
				?.split("=")[1];

			if (typeof str !== "undefined") {
				return this.deserializer?.(str) ?? JSON.parse(str);
			}
		} catch (e) {
			console.error(e);
		}
		return undefined;
	}

	/** Store value in `cookie` */
	public override sync(value: T): boolean {
		const cookies = typeof document === "undefined" ? null : document.cookie;
		if (cookies !== null) {
			const str = this.serializer?.(value) ?? JSON.stringify(value);
			const cookieComponents: string[] = [`${encodeURI(str)}`, `SameSite=${this.sameSite}`];
			if (this.domain) cookieComponents.push(`Domain=${this.domain}`);
			if (this.secure) cookieComponents.push("Secure");
			if (this.expires) cookieComponents.push(`Expires=${this.expires.toUTCString()}`);
			if (this.hostOnly) cookieComponents.push("HostOnly");
			if (this.httpOnly) cookieComponents.push("HttpOnly");
			if (this.path) cookieComponents.push(`Path=${this.path}`);

			document.cookie = `${this.name}=${cookieComponents.join("; ")}`;
		}
		return false;
	}
}
