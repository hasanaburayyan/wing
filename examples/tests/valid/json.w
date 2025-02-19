let json_number  = Json 123;
let json_bool    = Json true;
let json_array   = Json [ 1, 2, 3 ];
let json_obj     = Json { boom: 123 };
let json_mut_obj = MutJson {
  hello: 123,
  world: [ 1, "cat", 3 ],
  "boom boom": { hello: 1233 }
};

let message = "Coolness";

// Reassign
json_mut_obj.set("hello", message);

assert(json_mut_obj.get("hello") == message);
// Support `dot` and `[]` Access https://github.com/winglang/wing/issues/1680
// assert(json_mut_obj.hello == message)
// assert(json_mut_obj["hello"] == message)

// Assignment from natives
let some_number: num = 999;

let jj = Json some_number;
let jj1 = Json {foo: some_number};
let jj2 = Json [ some_number, {bar: some_number} ];

let get_str = (): str => {
  return "hello";
};

let jj3 = Json get_str();
assert(jj3 == Json "hello");

class Foo {
  _sum_str: str;
  init() {
    this._sum_str = "wow!";
  }
}

let f = new Foo();
let jj4 = Json f._sum_str;
assert(jj4 == Json "wow!");

let some_json = MutJson {
  x: some_number
};

assert(some_json.get("x") == some_number);
some_json.set("x", 111);
assert(some_json.get("x") == 111);

// assign Map to Json
let x: Json = {cool: "beans"};

// Nested Gets and Sets
let nested_json = MutJson {
  a: "hello",
  b: {
    c: "world",
    d: {
      foo: "foo",
      bar: 123
    }
  }
};

nested_json.get("b").get("d").set("foo", "tastic");
assert(nested_json.get("b").get("d").get("foo") == "tastic");
assert(nested_json.get("b").get("d").get("bar") == 123);

// Heterogenous Array
let b = "buckle";
let arr = Json [1, 2, b, "my", "shoe", 3, 4, [ "shut", "the", "door"]];
assert(arr.get_at(0) == 1);
assert(arr.get_at(2) == b);
assert(arr.get_at(7).get_at(0) == "shut");

// Nested Json with mixed Json and non-json literals
Json {
  a: Json [1, 2, "world"],
  b: [1, 2, "world"], // Verify the type-checker knows we're still in a Json after handling `a` above
};

// Empty Jsons
let empty_json = Json {};
let empty_json_arr = Json [];

// start mutjson empty
let empty_mut_json = MutJson {};
let empty_mut_json_arr = MutJson [];

// then get crazy with it
empty_mut_json.set("cool", MutJson{a: 1, b: 2});
empty_mut_json.get("cool").set("a", 3);

empty_mut_json_arr.set_at(0, MutJson{a: 1, b: 2});
empty_mut_json_arr.get_at(0).set("a", 3);

// Wanna see something nuts?
let the_tower_of_json = MutJson {
  a: {},
  b: {
    c: {},
    d: [
      [
        [
          {}
        ]
      ],
    ],
  },
  e: {
    f: {
      g: {},
      h: [
        {},
        []
      ]
    },
  }
};

the_tower_of_json.get("e").get("f").get("h").get_at(0).set("a", 1);
let that_super_nested_value = the_tower_of_json.get("e").get("f").get("h").get_at(0).get("a");
assert(num.from_json(that_super_nested_value) == 1);

// Unested Json Arrays
let unested_json_arr = Json [1, 2, 3];
assert(unested_json_arr.get_at(0) == 1);