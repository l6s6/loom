export default interface Note {
    id: number,
    title: string,
    content: string,
    status: string,
    note_type: {
        id: number,
        name: string
    },
    tags: {
        id: number,
        name: string
    }[],
    created_at: Date,
    modified_at: Date,
}