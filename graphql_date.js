// A scalar type resolver needs to be an object of the class GraphQLScalarType
const { GraphQLScalarType } = require('graphql');
// The kind property indicates the type of the token that the parser found
const { Kind } = require('graphql/language');

// A scalar type resolver needs to be an object of the class GraphQLScalarType
// The constructor of GraphQLScalarType takes an object with various properties
// create resolver
const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    // return isNaN(dateValue) ? undefined : dateValue;
    return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
  },
  // the argument ast contains a kind property as well as a value property.
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value);
      return Number.isNaN(value.getTime()) ? undefined : value;
    }
    return undefined;
  },
});

module.exports = GraphQLDate;
