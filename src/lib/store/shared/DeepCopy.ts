import {isObject, type UnknownObject} from "./UnknownObject";

/** */
export function deepCopy<T>(something: T): T {
	if (Array.isArray(something)) {
		return something.map((el) => deepCopy(el)) as T;
	} else if (isObject(something)) {
		const copy: UnknownObject = {};
		const keys = Object.keys(something);
		for (const key of keys) {
			const el = something[key];
			if (Array.isArray(el)) {
				copy[key] = el.map((e) => deepCopy(e));
			}
			// Special treatment for Date
			else if (el instanceof Date) {
				copy[key] = new Date(el.valueOf());
			} else if (typeof el === "object" && el !== null) {
				copy[key] = deepCopy(el);
			} else {
				copy[key] = el;
			}
		}
		return copy as T;
	}

	return something;
}
