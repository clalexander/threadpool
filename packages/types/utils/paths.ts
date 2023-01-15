export type PathsPrimitive = string;

export type PathsArray = (PathsPrimitive | PathsObject)[];

export type PathsObject = {
  [Key in string]: Paths;
};

export type Paths = PathsArray | PathsObject;

export const paths: Paths = [
  'test',
  {
    test: [
      'property',
    ],
  },
  {
    andMe: {
      with: [
        'my property',
      ],
    },
  },
];
