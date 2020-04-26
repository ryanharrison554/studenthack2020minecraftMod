export default interface Message {
    to: string;
    from: string;
    content: string;
    err: string | undefined;
    status: number | undefined;
}