const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }
  type Todo {
    id: ID!
    name: String!
    description: String!
    complete: Boolean!
  }
  type Query {
    users: [User]!
    user(id: ID!): User!
    todos: [Todo]!
    todo(id: ID!): Todo!
    myTodos: [Todo]!
    me: User
  }
  type Mutation {
    login(data: AuthInput!): User!
    register(data: AuthInput!): User!
    logout: Boolean!
    addTodo(data: AddTodoInput!): Todo!
    editTodo(data: EditTodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
  }
  input AuthInput {
    username: String!
    password: String!
  }
  input AddTodoInput {
    name: String!
    description: String!
  }
  input EditTodoInput {
    id: ID!
    name: String
    description: String
    complete: Boolean
  }
`;

module.exports = typeDefs;
