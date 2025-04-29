class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor(head) {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      let current = this.head;
      while (current) {
        if (!current.next) {
          current.next = newNode;
          break;
        }
        current = current.next;
      }
    }
  }

  dequeue() {
    if (!this.head) {
      return null;
    } else {
      let value = this.head?.value;
      this.head = this.head.next;
      return value;
    }
  }

  print() {
    if (!this.head) {
      return [];
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

const queue = new Queue();
queue.add(2);
queue.add(3);
queue.add(4);
queue.add(25);
queue.dequeue();
console.log(queue.print());
