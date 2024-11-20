export type User = {
    name: string,
    email: string,
    photoURL: string,
    uid: string,
    bio: string,
    interest: string
}

export const NullUser:User = {
    name:'',
    email:'',
    photoURL:'',
    uid:'',
    bio:'',
    interest:''
}