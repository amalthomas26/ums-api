export const typeDefs =`#graphql

type User{
id:ID!
name:String!
email:String!
role:String!
}
type AuthPayload{
token:String!
user:User!

}
input RegisterInput{
name:String!
email:String!
password:String!
role:String!
}

input LoginInput{
email:String!
password:String!
}
type Query{
users(page:Int = 1,limit:Int = 10, search:String):[User!]!
user(id:ID!):User
me:User

}
type Mutation{
registerUser(input:RegisterInput!):User!
login(input:LoginInput!):AuthPayload!
deleteUser(id:ID!):Boolean!
}
`