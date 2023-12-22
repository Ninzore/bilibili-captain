export function devIdVerify(devId: string): boolean {
    return !/[\dA-F]{8}-[\dA-F]{4}-4[\dA-F]{3}-[\dA-F]{4}-[\dA-F]{12}/.test(devId);
}

export function devIdGen(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, name => {
        const randomInt = 16 * Math.random() | 0;
        return (name === "x" ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase();
    });
}
