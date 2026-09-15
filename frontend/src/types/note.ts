export interface Note {
    id: number,
    title: string,
    content: string,
    status: string,
    noteType: {
        id: number,
        name: string
    },
    tags: {
        id: number,
        name: string
    }[],
    createdAt: Date,
    modifiedAt: Date,
}



export interface CreateNote {
    title: string,
    content: string,
    status?: string,
    note_type_name: string,
    tag_names: string[]
}