export const gqlschema = /* GraphQL */ `
  directive @deepAuth(path: String, variables: [String]) on OBJECT

  enum PrivacyLevel {
    PRIVATE # Completely hidden, even from appearing in lists. Can only see if owner grants access
    INTERNAL # Others can see that object exists in lists, but can't see details without access
    PUBLIC # Public within the client org
  }

  enum AccessLevel {
    READ
    WRITE
    ADMIN
  }

  type User {
    uuid: ID!
    policies: [Policy] @relation(name: "GRANTED_POLICY", direction: "IN")
  }

  type Policy {
    policyId: ID!
    access: AccessLevel
    grantedTo: [User] @relation(name: "GRANTED_POLICY", direction: "OUT")
    appliedTo: [ProtectedType] @relation(name: "APPLIES_POLICY_TO", direction: "OUT")
  }

  interface ProtectedType {
    policies: [Policy] @relation(name: "APPLIES_POLICY_TO", direction: "IN")
    privacy: PrivacyLevel
  }

  type Dog {
    id: ID!
    name: String!
    breed: String!
    owner: User @relation(name: "HAS_OWNER", direction: "OUT")
  }

  type Cat implements ProtectedType
  @deepAuth(
    path: """
    { OR: [ { policies_some: { grantedTo_some: { uuid: "$uuid" } } }, { privacy: PUBLIC }  ] }
    """
    variables: ["$uuid"]
  ) {
    id: ID!
    name: String!

    policies: [Policy] @relation(name: "APPLIES_POLICY_TO", direction: "IN")
    privacy: PrivacyLevel
  }
`;
