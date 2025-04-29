class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedListe {
  constructor(head) {
    this.head = head;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  prepennd(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  pop() {
    if (!this.head) {
      return false;
    } else {
      this.tail = null;
      let current = this.head;
      while (current?.next) {
        if (!current.next.next) {
          this.tail = current;

          current.next = undefined;
        }
        current = current?.next ?? null;
      }
      return true;
    }
  }

  shift() {
    if (!this.head) {
      return false;
    } else {
      this.head = this.head.next;
      return true;
    }
  }

  display() {
    let current = this.head;
    const store = [];
    while (current) {
      const element = current?.value;
      if (element) store.push(element);
      current = current?.next;
    }
    return store;
  }
}

const list = new LinkedListe();
list.prepennd(1);
list.prepennd(2);
list.prepennd(5);
list.prepennd(4);
list.prepennd(5);

console.log(list.display());
console.log(list.pop());
console.log(list.pop());
console.log(list.shift());
console.log(list.display());
