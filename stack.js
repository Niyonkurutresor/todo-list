class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.head = null;
    this.length = 0;
    this.tail = null;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.length = 1;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  pop() {
    if (!this.head) {
      return null;
    } else {
      let current = this.head;
      let value = null;
      while (current) {
        if (!current?.next) {
          this.tail = current.next;
          value = current?.next?.value;
        }
        current = current.next;
      }
      return value;
    }
  }

  print() {
    if (!this.head) {
      return null;
    } else {
      let current = this.head;
      let store = [];
      while (current) {
        store.push(current.value);
        current = current.next;
      }
      return store;
    }
  }
}

const stack = new Stack();
stack.add(2);
stack.add(3);
stack.add(5);
stack.add(4);
console.log(stack.pop());
console.log(stack.print());
