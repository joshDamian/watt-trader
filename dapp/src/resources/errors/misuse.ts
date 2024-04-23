export class MisuseError extends Error {
    constructor(message: string) {
        super(`Misuse error: ${message}`);
        this.name = "MisuseError";
    }
}