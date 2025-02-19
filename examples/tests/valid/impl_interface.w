bring cloud;

class A impl cloud.IQueueAddConsumerHandler {
  init() {}
  inflight handle(msg: str) {
    return;
  }
}

let x: cloud.IQueueAddConsumerHandler = new A();

let y = inflight () => {
  x.handle("hello world!");
};

interface I1 {
  method_1(x: num): num;
}

interface I2 extends I1 {
  inflight method_2(x: str): str;
}

interface I3 extends I2 {
  method_3(x: Array<num>): Array<num>;
}

class r impl I3 {
  init() {}
  method_1(x: num): num {
    return x;
  }
  inflight method_2(x: str): str {
    return x;
  }
  method_3(x: Array<num>): Array<num> {
    return x;
  }
}

// a variable of some interface type can be assigned a class instance that implements it.
interface IAnimal {
  inflight eat();
}

class Dog impl IAnimal {
  init(){}
  inflight eat() {
    return;
  }
}

let z: IAnimal = new Dog();