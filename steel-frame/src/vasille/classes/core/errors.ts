const reportIt = "Report it here: https://gitlab.com/vasille-js/vasille-js/-/issues";

export function notOverwritten(): string {
    console.error("Internal error", "Must be overwritten", reportIt);
    return "not-overwritten";
}

export function internalError(msg: string): string {
    console.error("Internal error", msg, reportIt);
    return "internal-error";
}

export function userError(msg: string, err: string): string {
    console.error("Error", msg);
    return err;
}

export function wrongBinding(msg: string): string {
    return userError(msg, "wrong-binding");
}
